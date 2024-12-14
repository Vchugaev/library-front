import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTitle } from './store/pageTitleSlice'
import axios from 'axios'
import noImage from './assets/images/no-image.svg'
import s from './assets/styles/notifications.module.css'
import { Link, useParams } from 'react-router-dom'
import { setNotificationsState } from './store/notificationSlice'



export default function Notifications() {
    const dispatch = useDispatch()
    dispatch(setTitle('Уведомления'))
    dispatch(setNotificationsState(0))
    const notifications = useSelector(state => state.notifications.count)
    const [notification, setNotification] = useState([])


    useEffect(() => {
        axios.get(`${import.meta.env.VITE_IP}/api/notifications`, {
            withCredentials: true,
        })
            .then((res) => setNotification(res.data))
            .catch((err) => console.error(err))
        axios.get(`${import.meta.env.VITE_IP}/api/clearnotifications`, {
            withCredentials: true,
        })
            .catch((err) => console.error(err))
    }, [])

    return (
        <>
            <main className={s.main}>
                <div className={s.notemain} >
                    {notification && notification.map((note) => (
                        <Link to={`/${note.link}`} key={note._id}>
                            <div className={s.notebox}>
                                <div className={s.imagebox}>
                                    <div className={s.bookimage} style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: !note.image ? '50px' : 'cover', backgroundImage: note.image ? `url(${import.meta.env.VITE_IP}/${note.image})` : `url(${noImage})` }} alt="" />
                                </div>
                                <div>
                                    <h4>{note.title}</h4>
                                    <p>{note.message}</p>
                                </div>
                            </div>

                            <hr className={s.hr} />
                        </Link>
                    ))}
                </div>
            </main>
        </>
    )
}
