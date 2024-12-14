import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

export default function IsUserBook({ book }) {

  const profile = useSelector((state) => Object.values(state.profile.entities)[0])

  

  if (profile && profile?.purchasedBooks.includes(book?._id)) {
    return (
      <div>
        Это ваша книга - <NavLink to={`/edit/${book._id}`} >редактировать</NavLink>?
      </div>
    )
  }
}
