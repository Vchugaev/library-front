import React, { useState, useEffect } from 'react';
import axios from 'axios';
import s from './assets/styles/profile.module.css'
import { useDispatch, useSelector } from 'react-redux';
import review from './assets/images/review.svg'
import reviewPol from './assets/images/review-pol.svg'
import noReview from './assets/images/noReview.svg'
import noImage from './assets/images/no-image.svg'
import profileImage from './assets/images/profile.png'
import { NavLink } from 'react-router-dom';
import { addProfile, fetchProfile, setImage } from './store/profileSlice';
import { fetchUser } from './store/userSlice';
import { setTitle } from './store/pageTitleSlice';



export default function Profile() {
    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);

    const user = useSelector((state) => Object.values(state.user.entities)[0])
    const profile = useSelector((state) => state.profile.entities.profile)


    const dispatch = useDispatch()
    dispatch(setTitle('Профиль'))

    useEffect(() => {
        dispatch(fetchUser())
        dispatch(fetchProfile())
    }, [])


    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        const formData = new FormData()
        if (avatar) {
            formData.append('avatar', avatar);
        }
        if (banner) {
            formData.append('banner', banner);
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_IP}/api/user`, formData, {
                withCredentials: true,
            });

            console.log(response.data);
            console.log(profile);
            
            dispatch(setImage({ profile: response.data.profile }))
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (banner || avatar) {
            handleSubmit()
        }
    }, [avatar, banner])
    function calculateRating(books) {
        if (!books || books.length === 0) return 0
        const totalRating = books.reduce((sum, book) => sum + parseFloat(book.rating || 0), 0);
        return (totalRating / books.length).toFixed(1)
    }
    function renderStars(rating) {
        const fullStars = Math.max(0, Math.floor(rating));
        const halfStars = Math.max(0, Math.ceil(rating) > fullStars ? 1 : 0);
        const emptyStars = Math.max(0, 5 - fullStars - halfStars);


        const stars = [
            ...Array(fullStars).fill(review),
            ...Array(halfStars).fill(reviewPol),
            ...Array(emptyStars).fill(noReview)
        ];

        return (
            <div>
                {stars.map((star, index) => (
                    <img key={index} src={star} alt="star" />
                ))}
            </div>
        );
    }

    return (
        <div className={s.profilecontainer}>

            <div
                style={{
                    backgroundImage: profile?.profile?.banner ? `url(${import.meta.env.VITE_IP}/${profile?.profile?.banner})` : ``,
                }}
                className={s.bannerBox}
            >
                <label className={s.customupload}>
                    Загрузить баннер
                    <input
                        onChange={(e) => { e.target.files[0] && setBanner(e.target.files[0]) }}
                        accept="image/*"
                        className={s.inputbanner} type="file" />
                </label>

            </div>
            <div className={s.avatarbox}>
                <div>
                    <div style={{
                        backgroundImage: profile?.profile?.avatar ? `url(${import.meta.env.VITE_IP}/${profile?.profile?.avatar})` : `url(${profileImage})`,
                    }}
                        className={s.avatar}
                    >
                        <label className={s.customuploadavatar}>
                            Загрузить аватар
                            <input
                                onChange={(e) => { e.target.files[0] && setAvatar(e.target.files[0]) }}
                                accept="image/*"
                                className={s.inputavatar} type="file" />
                        </label>
                    </div>
                </div>
                <div className={s.username}>
                    <span >{profile?.username}</span>
                    <p className={s.bio}>{profile?.profile?.bio}</p>
                    <div className={s.biobox}>
                        <a href={profile?.profile?.website}>Сайт</a>
                        <p>{profile?.profile?.location}</p>
                    </div>
                </div>
            </div>

            <div>
                <h2>Мои книги: ({profile?.reviews?.length})</h2>
                <div className={s.booksbox}>
                    {profile && profile?.reviews?.map((book, index) => (
                        <NavLink key={index} to={`/book/${book._id}`}>
                            <div className={s.bookbox}>
                                <div className={s.bookimage} style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: !book.coverImage ? '50px' : 'cover', backgroundImage: book.coverImage ? `url(${import.meta.env.VITE_IP}/${book.coverImage})` : `url(${noImage})` }} alt="" />
                                <h4 className={s.booktitle}>{book.title}</h4>
                                <span className={s.bookauthor}>{book.author}</span>
                                <div className={s.bookrating}>
                                    {renderStars(calculateRating(book?.reviews))}
                                    {calculateRating(book?.reviews)}
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div >
    )
}
