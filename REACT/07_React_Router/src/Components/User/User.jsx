import React from 'react'
import { useParams } from 'react-router-dom'


function User() {
    //getting the params
    const {id}=useParams()
  return (
    <div>
      <h1>HI man this is PRAMS:{id}</h1>
    </div>
  )
}

export default User
