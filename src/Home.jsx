import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTitle } from './store/pageTitleSlice'
import s from './assets/styles/home.module.css'
import axios from 'axios';
import SliderHome from './components/SliderHome';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import noImage from './assets/images/no-image.svg'
import action from './assets/images/icons/action.png'
import adult from './assets/images/icons/adult.png'
import adventure from './assets/images/icons/adventure.png'
import autobiography from './assets/images/icons/autobiography.png'
import comedy from './assets/images/icons/comedy.png'
import crime from './assets/images/icons/crime.png'
import drama from './assets/images/icons/drama.png'
import dystopian from './assets/images/icons/dystopian.png'
import horror from './assets/images/icons/horror.png'
import mystery from './assets/images/icons/mystery.png'
import sciFi from './assets/images/icons/sci-fi.png'
import selfHelp from './assets/images/icons/self-help.png'
import thriller from './assets/images/icons/thriller.png'
import romance from './assets/images/icons/romance.png'


const categories = [
  { id: 'action', name: 'Боевик', icon: action },
  { id: 'adventure', name: 'Приключения', icon: adventure },
  { id: 'autobiography', name: 'Автобиография', icon: autobiography },
  { id: 'comedy', name: 'Комедия', icon: comedy },
  { id: 'crime', name: 'Криминал', icon: crime },
  { id: 'drama', name: 'Драма', icon: drama },
  { id: 'dystopian', name: 'Утопия', icon: dystopian },
  { id: 'horror', name: 'Хорроры', icon: horror },
  { id: 'mystery', name: 'Мистика', icon: mystery },
  { id: 'romance', name: 'Романы', icon: romance },
  { id: 'sciFi', name: 'Научная фантастика', icon: sciFi },
  { id: 'selfHelp', name: 'Саморазвитие', icon: selfHelp },
  { id: 'thriller', name: 'Триллер', icon: thriller },
  { id: 'adult', name: 'Для взрослых', icon: adult },
];


export default function Home() {
  const dispatch = useDispatch()
  dispatch(setTitle('Главная'))
  const [library, setLibrary] = useState([])
  const user = useSelector((state) => Object.values(state.user.entities)[0])
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_IP}/api/mylibrary`, {
      withCredentials: true,
    }).then((res) => {
      setLibrary(res.data)
      console.log(res.data)
    })
  }, [])

  const handleCategoryClick = async (categoryId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_IP}/api/categories?category=${categoryId}`);
      console.log(response.data)
      navigate(`/category/${categoryId}`);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <>
      <main className={s.main}>
        <h2>Топ 10</h2>
        <SliderHome />
        <div className={s.librarymain}>
          <div className={s.information}>
            {user &&
              <div className={s.librarymain}>
                <h3>Ваша библиотека</h3>
                <div className={s.mylibrarybox}>
                  <div className={s.library}>
                    {library?.slice(0, 2).map((book, index) => (
                      <Link to={`/book/${book.bookId._id}`} key={book.bookId._id}>
                        <div className={s.notebox}>
                          <div className={s.imagebox}>
                            <div className={s.bookimage} style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: !book.bookId.coverImage ? '50px' : 'cover', backgroundImage: book.bookId.coverImage ? `url(${import.meta.env.VITE_IP}/${book.bookId.coverImage})` : `url(${noImage})` }} alt="" />
                          </div>
                          <div>
                            <h4>{book.bookId.title}</h4>
                            <p>{book.bookId.description}</p>
                          </div>
                        </div>

                        <hr className={s.hr} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            }
            <div className={s.categoriesmain}>
              <h3 className={s.categoriestitle}>Откройте для себя популярные категории</h3>
              <div className={s.categories}>
                {categories.map(({ id, name, icon }) => (
                  <div style={{ cursor: 'pointer' }} key={id} className={s.category} onClick={() => handleCategoryClick(id)}>
                    <img src={icon} alt={`${name} Icon`} />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )

}
