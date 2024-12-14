import React, { useEffect, useState } from 'react';
import s from './assets/styles/publish.module.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setTitle } from './store/pageTitleSlice'
import { Navigate, useNavigate } from 'react-router-dom';


export default function Publish() {
    const [title, setTitleBook] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [author, setAuthor] = useState('');
    const dispatch = useDispatch()
    dispatch(setTitle('Публикация'))
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (title && author && description && genre && price) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('title', title)
            formData.append('author', author)
            formData.append('description', description)
            formData.append('price', price)
            formData.append('genre', genre)
            formData.append('isAvailable', isOpen !== undefined ? isOpen : false)
            formData.append('coverImage', image)

            try {
                const response = await axios.post(`${import.meta.env.VITE_IP}/api/publish`, formData, {
                    withCredentials: true,
                });

                console.log(response.data);
                return navigate("/")
            } catch (error) {
                console.error('Error submitting form:', error.response?.data || error.message);
            }
        }
    };


    return (
        <section>
            <div className={s.main}>
                <h2>Опубликовать новую книгу</h2>
                <form>
                    <div className={s.inputbox}>
                        <label className={s.label}>Название книги</label>
                        <input required
                            placeholder='Название книги'
                            className={s.input}
                            type="text"
                            value={title}
                            onChange={(e) => setTitleBook(e.target.value)}
                        />
                    </div>
                    <div className={s.inputbox}>
                        <label className={s.label}>Автор</label>
                        <input required
                            placeholder='Автор'
                            className={s.input}
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                    </div>
                    <div className={s.inputbox}>
                        <label className={s.label}>Краткое описание книги</label>
                        <textarea required
                            placeholder='Описание...'
                            className={s.input}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className={s.inputbox}>
                        <label className={s.label}>Жанр книги</label>
                        <input
                            placeholder='Жанр'
                            required
                            className={s.input}
                            type="text"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        />
                    </div>
                    <div className={s.inputbox}>
                        <label className={s.label}>Цена</label>
                        <input
                            required
                            placeholder='Цена'
                            className={s.input}
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className={s.inputbox}>
                        <label className={s.label}>Картинка</label>
                        {image && <img src={image} alt="Preview" className={s.imagePreview} />}
                        <input
                            className={s.input}
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className={s.inputbox}>
                        <label className={s.label}>Открытый доступ</label>
                        <div>
                            <input

                                value='Да'
                                className={s.input}
                                type="radio"
                                checked={isOpen === true}
                                onChange={() => setIsOpen(true)}
                            />
                            <label>Да</label>
                            <input
                                value='Нет'
                                className={s.input}
                                type="radio"
                                checked={isOpen === false}
                                onChange={() => setIsOpen(false)}
                            />
                            <label>Нет</label>
                        </div>
                    </div>
                    <div className={s.inputbox}>
                        <label className={s.label}>Книга в формате PDF</label>
                        <input
                            required
                            className={s.input}
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>
                    <button className={s.publish} onClick={(e) => handleSubmit(e)}>
                        Опубликовать книгу
                    </button>
                </form>

            </div>
        </section>
    );
}
