// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { signupUser } from '../redux/slices/AuthSlice';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../component/Navbar';

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resultAction = await dispatch(signupUser({ email, name, username, password }));
      
      if (signupUser.fulfilled.match(resultAction)) {
        navigate('/verify-otp');
      } else {
        setError(resultAction.payload);
      }
    } catch (error) {
      setError('Signup failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
   <>
   <div className='bg-[#111] '>
   <Navbar/>
    <div className='min-h-screen flex justify-center items-center flex-col gap-4'>
      <div className='form bg-[#F4F7FB] h-auto w-[90%] max-w-[450px] px-[5%] py-[8%] border border-gray-800 rounded-lg shadow-lg shadow-black/50'>
        <h2 className='text-2xl mb-6 text-center text-[#1089D3]'>Sign Up</h2>
        
        <input 
          type='text'
          placeholder='Username'
          className='mb-4 p-3 border border-gray-700 rounded-lg w-full focus:outline-none focus:border-blue-500 bg-[white] text-[#111]'
          onChange={(e) => setUsername(e.target.value)}
          required 
        />
        <input 
          type='email'
          placeholder='Email'
          className='mb-4 p-3 border border-gray-700 rounded-lg w-full focus:outline-none focus:border-blue-500 bg-[white] text-white'
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type='password'
          placeholder='Password'
          className='mb-6 p-3 border border-gray-700 rounded-lg w-full focus:outline-none focus:border-blue-500 bg-[white] text-white'
          onChange={(e) => setPassword(e.target.value)}
          required 
        />

        {error && <p className='text-red-500 mb-4'>{error}</p>}
        
        <div className='mb-4 text-center text-gray-300'>
          <span className='text-sm text-black'>Already have an account? <Link to='/' className=' text-blue-500 hover:text-blue-300'>Sign in</Link></span>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl w-full font-semibold transition-colors duration-300'
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </div>
    </div>
    </div>
    </>
  )
}

export default SignupForm