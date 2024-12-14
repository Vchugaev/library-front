import React, { useState } from 'react'
import review from '../assets/images/review.svg'
import reviewPol from '../assets/images/review-pol.svg'
import noReview from '../assets/images/noReview.svg'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export default function Reviews({ reviews, s }) {
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(null)
    const { bookId } = useParams()

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

    const submitComment = async () => {
        if (comment && rating) {
            await axios.post(`${import.meta.env.VITE_IP}/api/booksetrating`, {
                comment,
                rating,
                bookId
            }, { withCredentials: true })
        }
    }


    return (
        <>
            <div>
                <div>
                    <form>
                        <label htmlFor="comment">Комментарий</label>
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} className={s.ratingcomment} />
                        <label htmlFor="rating">Оценка</label>
                        <div className={s.radioButtonContainer}>
                            {Array.from({ length: 10 }, (_, i) => (
                                <div key={i + 1}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        id={`rating-${i + 1}`}
                                        className={s.radioButton}
                                        value={i + 1}
                                        onChange={(e) => setRating(e.target.value)}
                                    />
                                    <label htmlFor={`rating-${i + 1}`} className={s.radioLabel}>
                                        {i + 1}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button onClick={submitComment} className={s.reviewpublish}>Опубликовать</button>
                    </form>
                </div>
            </div>
            {reviews.map((review, index) => (
                <div className={s.ratingbox} key={index}>
                    <div className={s.ratinguser}>
                        <span>{review.user.username}</span>
                        <span>{renderStars(review.rating)}</span>
                    </div>
                    <span className={s.comment}>{review.comment}</span>
                </div>
            ))}
        </>
    )
}
