import React, { useEffect, useState } from 'react'
import logo from '../assets/images/logo.svg'
import styles from '../assets/styles/aside.module.css'
import overwiew from '../assets/images/overwiew.svg'
import settings from '../assets/images/settings.svg'
import notification from '../assets/images/notification.svg'
import bookmark from '../assets/images/bookmark.svg'
import exit from '../assets/images/exit.svg'

import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import profileImage from '../assets/images/profile.png'
import axios from 'axios'
import { resetUser } from '../store/userSlice'
import { resetProfile } from '../store/profileSlice'
import { setNotificationsState } from '../store/notificationSlice'

export default function Aside() {
    const profile = useSelector((state) => Object.values(state.profile.entities)[0])
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const notificationCount = useSelector(state => state.notifications.count)

    const logout = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_IP}/api/logout`, {}, { withCredentials: true })
            console.log(response.data.message)
            dispatch(resetUser())
            dispatch(resetProfile())
            return navigate("/", { replace: true })
        } catch (error) {
            console.error('Ошибка выхода:', error.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_IP}/api/notificationscount`, {
            withCredentials: true,
        })
            .then((res) => dispatch(setNotificationsState(res.data.length)))
            .catch((err) => console.error(err))
    }, [])

    const getImgClass = (path) => {
        return location.pathname === path ? styles.active : '';
    }
    return (
        <>
            <aside className={styles.aside}>
                <div className={styles.box}>
                    <NavLink className={styles.logo} to={'/'}><img src={logo} alt="" /></NavLink>
                    <div className={styles.boxitems}>
                        <NavLink to={'/'}><img className={getImgClass('/')} src={overwiew} alt="" /></NavLink>
                        <NavLink to={'/notifications'}>
                            <img className={getImgClass('/notifications')} src={notification} alt="" />
                            {notificationCount > 0 &&
                                <div className={styles.notifications}>
                                    <span>{notificationCount}</span>
                                </div>
                            }
                        </NavLink>
                        <NavLink to={'/bookmarks'}><img className={getImgClass('/bookmarks')} src={bookmark} alt="" /></NavLink>
                        <NavLink to={'/settings'}><img className={getImgClass('/settings')} src={settings} alt="" /></NavLink>
                    </div>
                    <div className={styles.profileitems}>
                        <NavLink to={'/profile'}> <div style={{
                            backgroundImage: profile?.profile?.avatar ? `url(${import.meta.env.VITE_IP}/${profile?.profile?.avatar})` : `url(${profileImage})`,
                        }} className={styles.profilebox}></div></NavLink>
                        <button onClick={logout} className={styles.exit}><img src={exit} alt="" /></button>
                    </div>

                </div>
            </aside>
        </>
    )
}