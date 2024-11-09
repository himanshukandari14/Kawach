import React from 'react'
import logo from '../assets/logo.svg'
import cross from '../assets/cross.svg'
import qr from '../assets/qr.svg'
import social1 from '../assets/social1.svg'
import insta from '../assets/insta.svg'
import telegram from '../assets/telegram.svg'
import figma from '../assets/figma.svg'
import whatsapp from '../assets/whatsapp.svg'

const Qrcode = () => {
  return (
    <>  
     <div className='bg-[#111] h-screen'>
     <div className="nav p-10 flex justify-between items-center">
        <img className='h-28 w-28' src={logo} alt="Logo" />
        <img className='h-10 w-10' src={cross} alt="cross" />
      </div>

      <div className='flex justify-center items-center'>
        <img className='h-96 w-96' src={qr} alt="qr" />
      </div>

      <div className='flex justify-center items-center gap-10 mt-28'>
        <img src={social1} alt="social" />
        <img src={insta} alt="insta" />
        <img src={telegram} alt="telegram" />
        <img src={figma} alt="figma" />
        <img src={whatsapp} alt="whatsapp" />
      </div>

      </div>
    </>
  )
}

export default Qrcode
