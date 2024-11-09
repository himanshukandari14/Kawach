// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { loginUser } from '../redux/slices/Authslice'
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.svg'
import Navbar from '../components/Navbar';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error} = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser({ 
        email,
        password
      }));
      
      if (loginUser.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A2E] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[url('/nebula.jpg')] opacity-30 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-cyan-900/50" />
      </div>

      <Navbar />
      
      <div className="relative flex justify-center items-center min-h-[calc(100vh-6rem)] px-4">
        <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
          <h2 className="text-4xl font-black mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            Welcome Back
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 placeholder:text-white/50"
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 placeholder:text-white/50"
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm font-medium bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Log in'
              )}
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <Link to="/accounts/emailsignup" className="text-white/80 hover:text-white transition-colors duration-300">
                Don't have an account? <span className="text-cyan-400">Sign up</span>
              </Link>
              <Link to="/forgot-password" className="text-white/80 hover:text-white transition-colors duration-300">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm