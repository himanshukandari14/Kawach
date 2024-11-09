import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector, useDispatch } from 'react-redux';
import { getUserFromToken, uploadDocument, fetchUserDocuments } from '../redux/slices/Authslice';
import axios from 'axios';
import FileCard from '../components/FileCard';
import Usertab from '../components/Usertab';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userData, loading, documents } = useSelector((state) => state.auth);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getUserFromToken());
      dispatch(fetchUserDocuments(token));
    }
  }, [dispatch]);

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Refresh documents list after successful upload
      dispatch(fetchUserDocuments(token));
      setUploading(false);
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error.response?.data?.message || 'Upload failed');
      setUploading(false);
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  return (
    <div className="min-h-screen bg-[#0A0A2E] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Usertab />
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
          Document Dashboard
        </h1>

        <div {...getRootProps()} className={`
          p-10 border-2 border-dashed rounded-xl mb-8 text-center cursor-pointer
          transition-all duration-300 backdrop-blur-xl bg-white/5
          ${isDragActive ? 'border-cyan-400 bg-white/10' : 'border-white/20'}
        `}>
          <input {...getInputProps()} />
          {uploading ? (
            <div className="text-cyan-400">Uploading...</div>
          ) : isDragActive ? (
            <p className="text-cyan-400">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-xl mb-2">Drag & drop files here</p>
              <p className="text-white/50">or click to select files</p>
              <p className="text-xs text-white/30 mt-2">
                Supported formats: PDF, DOC, DOCX, PNG, JPG
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Recent Uploads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents && documents.map((doc) => (
              <FileCard
                key={doc._id}
                file={{
                  id: doc._id,
                  name: doc.title,
                  size: 'N/A', // You can add file size to your document model if needed
                  type: doc.title.split('.').pop().toUpperCase(),
                  lastModified: doc.createdAt,
                  thumbnail: '📄',
                  isActive: doc.isActive
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
