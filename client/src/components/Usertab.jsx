import React from 'react'
import { useSelector } from 'react-redux';

const Usertab = () => {
  const { userData, loading } = useSelector((state) => state.auth);

  // Get initials from email
  const getInitials = (email) => {
    return email ? email.split('@')[0].substring(0, 2).toUpperCase() : 'U';
  };

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-between w-full p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform duration-300">
          <span className="text-white font-bold text-lg">
            {getInitials(userData?.user?.email)}
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors">
            {userData?.user?.email?.split('@')[0] || 'User'}
          </span>
          <span className="text-sm text-white/60">
            {userData?.user?.email || 'loading...'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-white/60 text-sm">
          {userData?.user?.documents?.length || 0} files
        </span>
        <button className="p-2.5 hover:bg-white/10 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
          <svg className="w-6 h-6 text-white/70 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Usertab
