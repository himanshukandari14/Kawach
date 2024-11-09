// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { loginUser } from '../redux/slices/Authslice'
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.svg'
import Navbar from '../component/Navbar';

const LoginForm = () => {
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const {loading,error}=useSelector((state)=>state.auth);
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispatch the login action and wait for the result
    const resultAction = await dispatch(loginUser({ username, password }));

    // Check if the login was successful
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/feed'); // Redirect to /feed on successful login
    }
  };
  return (
    <>
    <div className='bg-[#111] text-white min-h-screen'>
      <Navbar/>
      <div className='flex justify-center items-center flex-col gap-6'>
        <div className='bg-[#F4F7FB] w-[40%] px-[10%] py-[8%] rounded-[20px]  border'>
          <h2 className='text-3xl mb-9 text-center text-[#1089D3] font-bold'>Login</h2>
              
          <input 
            type='email' 
            placeholder='Email' 
            className='mb-6 p-3 border border-gray-700 rounded-lg w-full focus:outline-none focus:border-blue-500 bg-[#fff] transition-all duration-300 text-black' 
            onChange={(e)=> setUsername(e.target.value)} 
          />
          <input 
            type='password' 
            placeholder='Password' 
            className='mb-6 p-3 border border-gray-700 rounded-lg w-full focus:outline-none focus:border-blue-500 bg-[#fff] transition-all duration-300 text-black'  
            onChange={(e) => setPassword(e.target.value)} 
          />

          {/* Display error message if there is an error */}
          {error && <p className='text-red-500 mb-4'>{error}</p>}

          <div className='mb-4 text-center'>
            <span className='text-sm text-[#111]'>Don't have an account? <Link to='/accounts/emailsignup' className='text-blue-400 hover:text-blue-300 transition-colors duration-300'>Sign up</Link></span>
          </div>

          <div className='space-y-4'>
            {/* Display loading text on button if loading */}
            <button
              onClick={handleSubmit}
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl w-full font-semibold transition-colors duration-300'
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
              
            <div className='text-center'>
              <a href='/forgot-password' className='text-blue-400 hover:text-blue-300 transition-colors duration-300'>Forgot password?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
   
  )
}

export default LoginForm