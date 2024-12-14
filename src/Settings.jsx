import React, { useEffect, useState } from 'react'
import s from './assets/styles/settings.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserField } from './store/userSlice'
import axios from 'axios';
import { updateProfileField } from './store/profileSlice';
import { setTitle } from './store/pageTitleSlice';


export default function Settings() {
    const dispatch = useDispatch();
    const user = useSelector((state) => Object.values(state.user.entities)[0])
    const profile = useSelector((state) => Object.values(state.profile.entities)[0])
    dispatch(setTitle('Настройки'))
    const [username, setUsername] = useState(profile?.username)
    const [email, setEmail] = useState(profile?.email)
    const [description, setDescription] = useState(profile?.profile.bio)
    const [location, setLocation] = useState(profile?.profile.location)
    const [social, setSocial] = useState(profile?.profile.website)
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    useEffect(() => {
        if (profile) {
            setUsername(profile.username)
            setEmail(profile.email)
            setDescription(profile.profile.bio)
            setLocation(profile.profile.location)
            setSocial(profile.profile.website)
        }
    }, [profile])
    const submitUserChange = (value) => {
        dispatch(updateProfileField({ id: profile._id, value }));
    };

    const saveChangePassword = async () => {

        if (password && newPassword) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_IP}/api/changepassword`, { oldPass: password, newPass: newPassword }, {
                    withCredentials: true,
                });

                console.log(response.data.message);

            } catch (error) {
                console.error(error.response?.data?.message);
            }

        }
    }

    const saveUserChanges = async () => {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('location', location)
        formData.append('website', social)
        formData.append('bio', description)
        formData.append('email', email)

        try {
            const response = await axios.post(`${import.meta.env.VITE_IP}/api/user`, formData, {
                withCredentials: true,
            });
            submitUserChange(response.data.user)
            console.log(response.data.user);

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <section className={s.main}>
            <div className={s.gradientbox} />

            <div className={s.profilebox}>
                <img src="" alt="" />
            </div>

            <div className={s.inputmain}>
                <div className={s.labelinputbox}>
                    <div className={s.inputbox}>
                        <label className={s.label}>Никнейм</label>
                        <input onChange={(e) => setUsername(e.target.value)} value={username || ''} placeholder='Например: Vchugaev' className={s.input} type="text" />
                    </div>
                    <div className={s.inputbox}>
                        <label className={s.label}>Email</label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email || ''} placeholder='vchugaevn@gmail.com' className={s.input} type="text" />
                    </div>
                </div>
                <div className={s.labelinputbox}>
                    <div className={s.inputbox}>
                        <label className={s.label}>Смена пароля</label>
                        <input onChange={(e) => setPassword(e.target.value)} placeholder='Старый пароль' className={s.input} type="text" />
                    </div>
                    <div className={s.inputbox}>
                        <label className={s.label}>Новый пароль</label>
                        <input onChange={(e) => setNewPassword(e.target.value)} placeholder='Новый пароль' className={s.input} type="text" />
                    </div>
                    <button onClick={saveChangePassword} className={s.savebutton}>Сменить</button>
                </div>
            </div>
            <div className={s.inputbox}>
                <label className={s.label}>Описание профиля</label>
                <textarea onChange={(e) => setDescription(e.target.value)} value={description || ''} placeholder='Напишите что-нибудь' className={s.input} type="text" />
            </div>
            <div className={s.inputbox}>
                <label className={s.label}>Локация</label>
                <input onChange={(e) => setLocation(e.target.value)} value={location || ''} placeholder='Москва?' className={s.input} type="text" />
            </div>
            <div className={s.inputbox}>
                <label className={s.label}>Ссылка на ваш сайт или соцсеть</label>
                <input onChange={(e) => setSocial(e.target.value)} value={social || ''} placeholder='https://t.me/?' className={s.input} type="text" />
            </div>

            <button onClick={saveUserChanges} className={s.savebutton}>Сохранить</button>
        </section>
    )
}
