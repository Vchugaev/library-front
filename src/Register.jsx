import React, { useState } from 'react'
import logo from './assets/images/logo.svg'
import styles from './assets/styles/register.module.css'
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addUser } from './store/userSlice';
import { setTitle } from './store/pageTitleSlice';


export default function Register() {
    const [login, setLogin] = useState()
    const [password, setPassword] = useState()
    const [email, setEmail] = useState()
    const dispatch = useDispatch()
    dispatch(setTitle('Регистрация'))


    const submitRegister = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_IP}/api/register`, {
                username: login,
                password: password,
                email: email
            }, { withCredentials: true }).then((res) => {
                const user = res.data.user
                console.log(user);

                dispatch(addUser({ id: user._id, user }));

            })


        } catch (err) {
            console.log(err)
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
                    <h1>Зарегистрироваться</h1>
                    <form action="">
                        <label htmlFor="">Логин</label>
                        <input value={login} onChange={e => setLogin(e.target.value)} className={styles.input} placeholder='Например: Vchugaev' type="text" />
                        <label htmlFor="">Пароль</label>
                        <input value={password} onChange={e => setPassword(e.target.value)} className={styles.input} placeholder='Пароль' type="password" />
                        <label htmlFor="">Email</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} className={styles.input} placeholder='vchuga@gmail.com' type="text" />
                    </form>
                    <div className={styles.submitbox}>
                        <button onClick={submitRegister}>Зарегистрироваться</button>
                    </div>
                </div>
            </div>

        </>
    )
}
