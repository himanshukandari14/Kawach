import React from 'react'
import logo from '../assets/logo.svg'

const Navbar = () => {
  return (
    <>
      <div className="nav p-10 flex justify-between items-center">
        <img className='h-28 w-28' src={logo} alt="Logo" />
        <h2 className='text-2xl font-bold tracking-wider'>DOC SHARE</h2>
      </div>
    </>
  )
}

export default Navbar
