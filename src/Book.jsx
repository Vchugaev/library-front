import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import s from './assets/styles/bookDetails.module.css'
import noImage from './assets/images/no-image.svg'
import review from './assets/images/review.svg'
import reviewPol from './assets/images/review-pol.svg'
import noReview from './assets/images/noReview.svg'
import bookmark from './assets/images/addBook.svg'
import deletebookmark from './assets/images/deletebookmark.png'
import Reviews from './components/Reviews'
import IsUserBook from './components/isUserBook'
import { useDispatch, useSelector } from 'react-redux'
import { setTitle } from './store/pageTitleSlice'




export default function Book() {
    const [book, setBook] = useState()
    const { bookId } = useParams()

    const dispatch = useDispatch()
    dispatch(setTitle(book?.title))
    const Bookmark = async () => {
        try {
            if (!book.bookmark) {
                await axios.post(`${import.meta.env.VITE_IP}/api/bookmarkadd`, { bookId }, { withCredentials: true })
                setBook(prev => ({ ...prev, bookmark: true }))
            } else {
                await axios.post(`${import.meta.env.VITE_IP}/api/bookmarkdelete`, { bookId }, { withCredentials: true })
                setBook(prev => ({ ...prev, bookmark: false }))
            }
        } catch (error) {
            console.error('Error updating bookmark:', error)
        }
    }
    const handleBuyBook = async () => {
        try {
            axios.post(`${import.meta.env.VITE_IP}/api/bookbuy`, {
                bookId
            }, { withCredentials: true })
            .then((res) => {
                if (!res.message) {
                    setBook(prev => ({ ...prev, suppressed: true }))
                }
            })
        } catch (error) {
            console.log(error);
            
        }
    }


    console.log(book);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_IP}/api/getbook`, {
            params: { bookId },
            withCredentials: true,
        })
            .then((res) => setBook(res.data))
            .catch((err) => console.error(err))
    }, [bookId])


    const published = new Date(book?.publishedAt)
    function calculateRating(books) {
        if (!books || books.length === 0) return 0
        const totalRating = books.reduce((sum, book) => sum + parseFloat(book.rating || 0), 0);
        return (totalRating / books.length).toFixed(1);
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

    const getBook = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_IP}/api/download`, {
                params: { bookId },
                responseType: 'blob',
                withCredentials: true
            });

            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : 'downloaded-file';

            const blob = new Blob([response.data], { type: response.data.type });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        } catch (err) {
            console.error('Ошибка при скачивании файла:', err);
        }
    }


    if (book) {
        return (
            <section className={s.main}>
                {book && <IsUserBook book={book} />}
                <div className={s.mainbox}>
                    <div className={s.imagebox}>
                        <div className={s.bookimage} style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: !book.coverImage ? '50px' : 'cover', backgroundImage: book.coverImage ? `url(${import.meta.env.VITE_IP}/${book.coverImage})` : `url(${noImage})` }} alt="" />
                    </div>
                    <div className={s.bookdetails}>
                        <h1 className={s.title}>{book.title} ({published.getFullYear()})</h1>
                        {!book.suppressed ?
                            <div className={s.buyBox}>
                                <button onClick={handleBuyBook} className={s.buyButton}>Купить - {book.price}</button>
                                <button onClick={Bookmark} className={s.addBookmark}><img src={book.bookmark ? deletebookmark : bookmark} alt="" /></button>
                            </div> :
                            <div className={s.buyBox}>
                                <button download onClick={getBook} className={s.buyButton}>Читать</button >
                            </div>
                        }
                        <div className={s.details}>
                            <h2>О книге</h2>
                            <div className={s.detailsbox}>
                                <div className={s.detailsName}>
                                    <span>Дата выхода</span>
                                    <span>Жанр</span>
                                    <span>Автор</span>
                                </div>
                                <div className={s.detailsInfo}>
                                    <span>{published.getFullYear()}</span>
                                    <span>{book.genre}</span>
                                    <span>{book.author}</span>
                                </div>
                            </div>
                            <h2>Отзывы</h2>
                            <Reviews reviews={book?.reviews} s={s} />
                        </div>
                    </div>
                    <div className={s.infoBox}>
                        <div className={s.overviewbox}>
                            <h3>Об авторе</h3>
                            <p>{book?.userDescription}</p>
                        </div>
                        <div className={s.overviewbox}>
                            <h3>Обзор</h3>
                            <p>{book?.description}</p>
                            <h3 className={s.rating}>{calculateRating(book?.reviews)}</h3>
                            <span className={s.ratingcount}>{book?.reviews.length} оценок</span>
                            <span className={s.stars}>{renderStars(calculateRating(book?.reviews))}</span>
                        </div>
                    </div>
                </div>
            </section>
        )
    } else {
        return (
            <p>Loading</p>
        )
    }
}