import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DocumentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Fetch document details
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/documents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDocument(response.data.document);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching document:', error);
        setError(error.response?.data?.message || 'Failed to fetch document');
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  // Timer effect for QR code expiry
  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setQrCode(null);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const generateQR = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/documents/${id}/qr`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Debug log to check response
      console.log('QR Response:', response.data);
      
      // Update this to use the correct path from response
      const qrCodeData = response.data.data?.qrCode || response.data.qrCodeImage;
      setQrCode(qrCodeData);
      setTimeLeft(300);
    } catch (error) {
      console.error('QR generation failed:', error);
      alert('Failed to generate QR code');
    }
  };

  // Format time remaining
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A2E] text-white p-8 flex items-center justify-center">
        <div className="text-cyan-400">Loading document...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A2E] text-white p-8">
        <div className="text-red-400">{error}</div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-cyan-400 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A2E] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-8 text-cyan-400 hover:underline flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        <div className="bg-white/5 rounded-xl p-8 backdrop-blur-xl border border-white/10">
          <h1 className="text-3xl font-bold mb-6">{document.title}</h1>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-white/50 mb-2">Upload Date</h3>
              <p>{new Date(document.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-white/50 mb-2">Status</h3>
              <p className={document.isActive ? 'text-green-400' : 'text-red-400'}>
                {document.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="mb-8 p-6 bg-white/5 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Temporary Access QR Code</h3>
            {qrCode ? (
              <div className="text-center">
                <img 
                  src={qrCode} // Use the full data URL directly
                  alt="QR Code" 
                  className="mx-auto mb-4 bg-white p-4 rounded-lg w-64 h-64"
                  onError={(e) => {
                    console.error('Failed to load QR code image');
                    e.target.style.display = 'none';
                    setQrCode(null);
                    alert('Failed to display QR code');
                  }}
                />
                <div className="text-cyan-400 font-medium">
                  Expires in: {formatTime(timeLeft)}
                </div>
                <p className="text-sm text-white/50 mt-2">
                  This QR code will expire in 5 minutes
                </p>
              </div>
            ) : (
              <button
                onClick={generateQR}
                className="w-full py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 
                  text-cyan-400 rounded-lg hover:from-cyan-500/30 hover:to-purple-500/30 
                  transition-colors"
              >
                Generate Temporary QR Code
              </button>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/download/${document._id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                      responseType: 'blob',
                    }
                  );

                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', document.title);
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('Download failed:', error);
                  alert('Failed to download file');
                }
              }}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
            >
              Download
            </button>
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this document?')) {
                  try {
                    const token = localStorage.getItem('token');
                    await axios.delete(
                      `${import.meta.env.VITE_API_BASE_URL}/user/documents/${document._id}`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    navigate('/dashboard');
                  } catch (error) {
                    console.error('Delete failed:', error);
                    alert('Failed to delete document');
                  }
                }
              }}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPage; 