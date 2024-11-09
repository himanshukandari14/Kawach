import React from 'react'
import logo from '../assets/logo.svg'

const Navbar = () => {
  return (
    <>
      <div className="nav p-10 flex justify-between items-center relative z-10 bg-black/30 backdrop-blur-lg border-b border-cyan-500/20">
        <div className="flex items-center space-x-4">
          <img className='h-[60px] w-full hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]' src={logo} alt="Logo" />
          <div className="h-12 w-[2px] bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full opacity-50 shadow-[0_0_15px_rgba(124,58,237,0.5)]"></div>
        </div>
        <h2 className='text-3xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 hover:scale-105 transition-all duration-300 cursor-default drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]'>
          DOC SHARE
        </h2>
      </div>
    </>
  )
}

export default Navbar
