import axios from 'axios';
import React, { useState, useEffect } from 'react';
import noImage from '../assets/images/no-image.svg';
import { Link, NavLink } from 'react-router-dom'

const DropdownMenu = (props) => {
    const [value, setValue] = useState([]); // Данные с книгами
    const [search, setSearch] = useState(''); // Поле для ввода текста
    const [isOpen, setIsOpen] = useState(false); // Состояние открытия/закрытия dropdown

    // Закрывает выпадающее меню при клике за его пределами
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown-container')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Функция для обрезки текста
    function truncateText(text, maxLength) {
        if (!text || typeof text !== 'string') return '';
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    // Обработчик изменения текста в инпуте
    const handleInputChange = (e) => {
        const newSearch = e.target.value;
        setSearch(newSearch);
        setIsOpen(true);

        axios.get(`${import.meta.env.VITE_IP}/api/booksearch`, {
            params: {
                search: newSearch // отправляем новое значение поиска
            }
        }).then(res => setValue(res.data));
    };

    // Обработчик клика по книге из выпадающего списка
    const handleSelectBook = (title) => {
        setSearch(title); // Устанавливаем текст инпута равным выбранному названию книги
        setIsOpen(false); // Закрываем выпадающее меню
    };

    return (
        <div className={props.style.container}>
            <input
                type="search"
                value={search}
                onChange={handleInputChange}
                placeholder="Найти книгу по автору, названию, описанию"
                className={props.style.nosubmit}
                onFocus={() => setIsOpen(true)} // Открывает меню при фокусе на инпуте
            />
            {isOpen && value.length > 0 && (
                <ul className={props.style.dropdown}>
                    {value.map((book) => (
                        <li
                            key={book._id}
                            className={props.style.item}
                        >
                            <Link to={`book/${book._id}`}>
                                <div className={props.style.bookbox}>
                                    <div>
                                        <div
                                            className={props.style.bookimage}
                                            style={{
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center',
                                                backgroundSize: !book.coverImage ? '50px' : 'cover',
                                                backgroundImage: book.coverImage
                                                    ? `url(${import.meta.env.VITE_IP}/${book.coverImage})`
                                                    : `url(${noImage})`
                                            }}
                                            alt=""
                                        />
                                    </div>
                                    <div className={props.style.bookinfo}>
                                        <span className={props.style.titlebook}>{book.title}</span>
                                        <span className={props.style.descriptionbook}>{truncateText(book.description, 50)}</span>
                                        <span className={props.style.authorbook}>Автор: {book.author}</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownMenu;
