import React, { useState } from 'react'
import logo from './assets/images/logo.svg'
import styles from './assets/styles/register.module.css'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { addUser, fetchUser } from './store/userSlice'
import { setTitle } from './store/pageTitleSlice'


export default function Register() {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    dispatch(setTitle('Войти'))
    const submitLogin = async () => {

        try {
            const response = await axios.post(`${import.meta.env.VITE_IP}/api/login`, {
                username: login,
                password: password
            }, { withCredentials: true }).then((res) => {
                const user = res.data.user
                console.log(user);

                dispatch(fetchUser())
                dispatch(fetchProfile())
            })


        } catch (err) {
            if (err.response) {
                console.log(err.response.data.message)
            } else {
                console.log('Что-то пошло не так. Попробуйте снова.')
            }
        }
    }
    const user = useSelector((state) => Object.values(state.user.entities)[0])
    if (user) {
        return <Navigate to="/" replace />;
    }


    return (
        <>
            <div className={styles.main}>
                <div className={styles.box}>
                    <div className={styles.img}>
                        <img src={logo} alt="" />
                    </div>
                    <h1>Войти</h1>
                    <form action="">
                        <label htmlFor="">Логин или Email</label>
                        <input value={login} onChange={(e) => setLogin(e.target.value)} className={styles.input} placeholder='Например: Vchugaev' type="text" />
                        <label htmlFor="">Пароль</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} placeholder='Пароль' type="password" />
                    </form>
                    <div className={styles.submitbox}>
                        <button onClick={() => submitLogin()}>Войти</button>
                    </div>
                </div>
            </div>

        </>
    )
}
