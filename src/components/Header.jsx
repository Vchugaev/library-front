import React, { useEffect, useState } from 'react'
import styles from '../assets/styles/header.module.css'
import { Link, NavLink } from 'react-router-dom'
import { fetchUser } from '../store/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile } from '../store/profileSlice'
import SearchableDropdown from './SearchDropdown'
import axios from 'axios'
import DropdownMenu from './SearchDropdown'

const Profile = () => {
    return (
        <>
            <div className={styles.registerBox}>
                <NavLink className={styles.register} to={"/register"}>Зарегистрироваться</NavLink>
                <NavLink className={styles.signin} to={"/login"}>Войти</NavLink>
            </div>
        </>
    )
}


export default function Header() {
    const dispatch = useDispatch()
    const user = useSelector((state) => Object.values(state.user.entities)[0])
    const pageTitle = useSelector((state) => state.pageTitle.title)
    const [searchValue, setSearchValue] = useState([])


    useEffect(() => {
        dispatch(fetchUser())
        dispatch(fetchProfile())
    }, [])

    return (
        <div className={styles.main}>
            <h1>{pageTitle}</h1>
            <DropdownMenu style={styles} />
            {!user && <Profile /> }
            {user && <NavLink to={"/publish"} className={styles.publish}>Опублкиовать книгу</NavLink>}
        </div>
    )
}
