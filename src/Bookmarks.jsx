import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import s from './assets/styles/bookmarks.module.css'
import noImage from './assets/images/no-image.svg'
import axios from 'axios'
import bookmark from './assets/images/addBook.svg'
import deletebookmark from './assets/images/deletebookmark.png'
import { useDispatch } from 'react-redux'
import { setTitle } from './store/pageTitleSlice'


export default function Bookmarks() {


    const [bookmarks, setBookmarks] = useState()
    const [library, setLibrary] = useState()

    const dispatch = useDispatch()
    dispatch(setTitle('Библиотека'))
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_IP}/api/bookmarks`, {
            withCredentials: true,
        }).then((res) => {
            setBookmarks(res.data)
            console.log(res.data)

        })

        axios.get(`${import.meta.env.VITE_IP}/api/mylibrary`, {
            withCredentials: true,
        }).then((res) => {
            setLibrary(res.data)
            console.log(res.data)

        })
    }, [])

    const Bookmark = async (book, index) => {
        try {
            await axios.post(`${import.meta.env.VITE_IP}/api/bookmarkdelete`, { bookId: book.bookId }, { withCredentials: true })
            const newBookmarks = [...bookmarks]
            newBookmarks.splice(index, 1)
            setBookmarks(newBookmarks)
        } catch (error) {
            console.error('Error updating bookmark:', error)
        }
    }

    return (
        <>
            <div className={s.main}>
                <div className={s.booksbox}>
                    {library?.map((book, index) => (
                        <div key={book._id} className={s.bookbox}>
                            <NavLink key={index} to={`/book/${book.bookId._id}`}>
                                <div className={s.bookimage} style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: !book.bookId.coverImage ? '50px' : 'cover', backgroundImage: book.bookId.coverImage ? `url(${import.meta.env.VITE_IP}/${book.bookId.coverImage})` : `url(${noImage})` }} alt="" >
                                </div>
                            </NavLink>
                            <h4 className={s.booktitle}>{book.bookId.title}</h4>
                            <span className={s.bookauthor}>{book.bookId.author}</span>
                        </div>
                    ))}
                </div>
                <hr className={s.hr} />
                <h2 className={s.title}>Закладки</h2>
                <div className={s.booksbox}>
                    {bookmarks?.map((book, index) => (
                        <div key={book._id} className={s.bookbox}>
                            <NavLink key={index} to={`/book/${book.bookId._id}`}>
                                <div className={s.bookimage} style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: !book.bookId.coverImage ? '50px' : 'cover', backgroundImage: book.bookId.coverImage ? `url(${import.meta.env.VITE_IP}/${book.bookId.coverImage})` : `url(${noImage})` }} alt="" >
                                </div>
                            </NavLink>
                            <button onClick={() => Bookmark(book, index)} className={s.addBookmark}><img src={deletebookmark} alt="" /></button>
                            <h4 className={s.booktitle}>{book.bookId.title}</h4>
                            <span className={s.bookauthor}>{book.bookId.author}</span>

                            <div className={s.bookrating}>

                            </div>
                        </div>
                    ))}
                </div>
            </div >
        </>


    )
}
