import React, { useEffect, useState } from 'react'
import s from '../assets/styles/sliderHome.module.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import axios from 'axios';
import noImage from '../assets/images/no-image.svg'
import { FastAverageColor } from 'fast-average-color';
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";


export default function SliderHome() {

  const [topbooks, settopbooks] = useState([])
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [colorsCache, setColorsCache] = useState({})
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_IP}/api/top10`).then(res => {
      settopbooks(res.data)
      getAverageRGB(res.data)
    })
  }, [])

  const handleSlideChange = (swiper) => {
    setActiveSlideIndex(swiper.activeIndex);
  };

  function getAverageRGB(books) {

    books.forEach(book => {
      const src = `${import.meta.env.VITE_IP}/${book.coverImage}`
      const fac = new FastAverageColor();
      fac.getColorAsync(src)
        .then(color => {
          setColorsCache(prev => ({
            ...prev,
            [book._id]: color.hex
          }))
        })
        .catch(e => {
          console.log(e);
        });
    });

  }


  if (topbooks.length > 0) {
    return (
      <>

        <div className={s.sliderbox}>
          <Swiper
            className={s.swiperwrapper}
            modules={[Autoplay]}
            spaceBetween={250}
            slidesPerView={4}
            autoplay={{
              delay: 2500,
              disableOnInteraction: true,
            }}
            onSlideChange={handleSlideChange}
            onSwiper={(swiper) => setActiveSlideIndex(swiper.activeIndex)}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 250
              },
              480: {
                slidesPerView: 1,
                spaceBetween: 250
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 250
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 250
              }, 
            }}
          >
            {topbooks.map((book, index) => (
              <SwiperSlide

                key={book._id}
                className={`${activeSlideIndex === index ? s.activeslide : ''} ${s.swiperslide} `}
              >
                <div className={s.bookbox}>
                  <div
                    className={s.bookimage}
                    style={{
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: !book.coverImage ? '50px' : 'cover',
                      backgroundImage: book.coverImage ? `url(${import.meta.env.VITE_IP}/${book.coverImage})` : `url(${noImage})`
                    }}
                    alt="image"
                  />
                </div>
                <span style={{ color: colorsCache[book._id] }} className={s.bookindex}>{index + 1}</span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </>
    )
  } else {
    return <div>Loading...</div>
  }
}
