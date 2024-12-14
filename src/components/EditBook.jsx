import React, { useEffect, useState } from 'react';
import s from '../assets/styles/publish.module.css';
import axios from 'axios';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import noImage from '../assets/images/no-image.svg'
import { deletebook } from '../store/profileSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle } from '../store/pageTitleSlice'

export default function EditBook() {
    const [title, setTitleBook] = useState('')
    const [description, setDescription] = useState('')
    const [genre, setGenre] = useState('')
    const [price, setPrice] = useState('')
    const [coverImage, setCoverImage] = useState(null)
    const [image, setImage] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [file, setFile] = useState(null)
    const [author, setAuthor] = useState('')

    const [book, setBook] = useState()
    const { bookId } = useParams()

    const profile = useSelector((state) => Object.values(state.profile.entities)[0])
    const dispatch = useDispatch()
    dispatch(setTitle('Редактирование'))


    const createImageObject = (e) => {
        const file = e.target.files[0]
        setImage(e.target.files[0])
        if (file) {
            setCoverImage(URL.createObjectURL(file))
        }
    }
    const navigate = useNavigate();

    useEffect(() => {
        if (book) {
            setTitleBook(book.title)
            setDescription(book.description)
            setAuthor(book.author)
            setGenre(book.genre)
            setPrice(book.price)
            setIsOpen(book.isAvailable)
            setImage(book.coverImage)
            setCoverImage(book.coverImage ? `${import.meta.env.VITE_IP}/${book.coverImage}` : `${noImage}`)
        }
    }, [book])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_IP}/api/getbook`, {
            params: { bookId },
            withCredentials: true,
        })
            .then((res) => setBook(res.data))
            .catch((err) => console.error(err))
    }, [bookId])


    const handleSubmit = async () => {
        if (title && author && description && genre && price) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('title', title)
            formData.append('author', author)
            formData.append('_id', bookId)
            formData.append('description', description)
            formData.append('price', price)
            formData.append('genre', genre)
            formData.append('isAvailable', isOpen !== undefined ? isOpen : false)
            formData.append('coverImage', image)

            try {
                const response = await axios.post(`${import.meta.env.VITE_IP}/api/editbook`, formData, {
                    withCredentials: true,
                });

                console.log(response.data);
            } catch (error) {
                console.error('Error submitting form:', error.response?.data || error.message);
            }
        }
    }

    const handleDelete = async () => {
        await axios.post(`${import.meta.env.VITE_IP}/api/deletebook`, { bookId }, {
            withCredentials: true,
        })
        dispatch(deletebook({ bookId }))
        return navigate('/', { replace: true });
    }


    return (
        <section>
            <div className={s.main}>
                <h2>Редактировать книгу</h2>
                <form>
                    <div className={s.inputbox}>
                        <label className={s.label}>Название книги</label>
                        <input
                            placeholder='Название книги'
                            className={s.input}
                            type="text"
                            value={title}
                            onChange={(e) => setTitleBook(e.target.value)}
                        />
                    </div>
                    <div className={s.inputbox}>
                        <label className={s.label}>Автор</label>
                        <input
                            placeholder='Автор'
                            className={s.input}
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                    </div>
                    <div className={s.inputbox}>
                        <label className={s.label}>Краткое описание книги</label>
                        <textarea
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
                            className={s.input}
                            type="text"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        />
                    </div>
                    <div className={s.inputbox}>
                        <label className={s.label}>Цена</label>
                        <input
                            placeholder='Цена'
                            className={s.input}
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className={s.inputbox}>
                        <label className={s.label}>Картинка</label>
                        {/* {image && <img src={createImageObject} alt="Preview" className={s.imagePreview} />} */}
                        <input
                            className={s.input}
                            type="file"
                            onChange={(e) => { setImage(e.target.files[0]); createImageObject(e) }}
                        />
                        <img src={coverImage} alt="" />
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
                            className={s.input}
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>
                </form>
                <div className={s.bookbuttons}>
                    <button className={s.publish} onClick={handleSubmit}>
                        Обновить книгу
                    </button>
                    <button className={s.publish} onClick={handleDelete}>
                        Удалить книгу
                    </button>
                </div>
            </div>
        </section>
    );
}
