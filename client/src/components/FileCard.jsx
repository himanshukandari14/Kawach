import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FileCard = ({ file }) => {
  const navigate = useNavigate();

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/download/${file.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file');
    }
  };

  return (
    <div 
      onClick={() => navigate(`/document/${file.id}`)}
      className={`p-4 rounded-xl backdrop-blur-xl bg-white/5 border 
        ${file.isActive ? 'border-white/10 hover:bg-white/10' : 'border-red-500/10 hover:bg-red-500/10'} 
        transition-all duration-300 group cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-400/20 to-purple-400/20 text-2xl">
            {file.thumbnail}
          </div>
          <div>
            <h3 className="font-medium text-lg text-white group-hover:text-cyan-400 transition-colors">
              {file.name}
            </h3>
            <div className="flex items-center space-x-3 text-sm text-white/50">
              <span>{file.size}</span>
              <span>•</span>
              <span>{file.type}</span>
              <span>•</span>
              <span>{new Date(file.lastModified).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-cyan-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-cyan-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileCard
