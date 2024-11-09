import React from 'react'
import kankal from '../assets/images/defaultimage.jpg'


const Profile = () => {
  return (
    <div className="bg-gray-900 text-white p-4  w-full    h-[100vh] mx-auto">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <span className="text-teal-400 text-xl mr-2">👤</span>
        <span className="text-lg lg:text-xl">Profile</span>
      </div>
      <button className="text-teal-400 text-sm lg:text-base">✏️ Edit</button>
    </div>
    <div className="flex items-center justify-center min-h-screen bg-gray-900">  
        
    <div className="w-[150px] absolute top-36  h-[150px] rounded-full border-4 border-teal-400 mb-2">
        <img src={kankal}  alt="kankal" className='rounded-full' /></div> 

      <div className="bg-gradient-to-b flex flex-col items-center justify-center from-gray-700 to-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full h-[450px]">  
      
         
          <h2 className="text-teal-300 text-xl font-bold">NAME</h2>  
         
        <div className="flex flex-col space-y-2">  
          <input  
            type="text"  
            placeholder="text"  
            className="border-b border-gray-500 bg-transparent text-white focus:outline-none"  
          />  
          <input  
            type="text"  
            placeholder="text"  
            className="border-b border-gray-500 bg-transparent text-white focus:outline-none"  
          />  
          <input  
            type="text"  
            placeholder="text"  
            className="border-b border-gray-500 bg-transparent text-white focus:outline-none"  
          />  
        </div>  
      </div>  
    </div>
  </div>
  )
}

export default Profile