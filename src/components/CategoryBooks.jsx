import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import s from '../assets/styles/categorybooks.module.css';
import noImage from '../assets/images/no-image.svg';

const CategoryBooks = () => {
    const { categoryId } = useParams();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_IP}/api/categories?category=${categoryId}`)

                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, [categoryId]);

    return (
        <div className={s.main}>
            <h2 className={s.title}>Книги в категории</h2>
            <div className={s.booksContainer}>
                {books.length > 0 ? (
                    books.map((book) => (
                        <Link to={`/book/${book._id}`}>
                            <div key={book._id} className={s.bookCard}>
                                <div
                                    className={s.bookimage}
                                    style={{
                                        backgroundImage: book.coverImage
                                            ? `url(${import.meta.env.VITE_IP}/${book.coverImage})`
                                            : `url(${noImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                                <div className={s.bookInfo}>
                                    <h3>{book.title}</h3>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className={s.noBooks}>Нет книг в этой категории.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryBooks;
