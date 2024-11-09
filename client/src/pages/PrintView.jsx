import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.svg';

const PrintView = () => {
  const { documentId, token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const verifyQRAccess = async () => {
      try {
        console.log('Verifying access for:', documentId, token);
        const response = await axios.get(
          `http://192.168.0.253:8000/verify/${documentId}/${token}`
        );
        console.log('Verification response:', response.data);
        setDocument(response.data.document);
        setLoading(false);
      } catch (error) {
        console.error('Verification failed:', error);
        setError('This QR code has expired or is invalid');
        setLoading(false);
      }
    };

    verifyQRAccess();
  }, [documentId, token]);

  const handlePrint = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.253:8000/print/${documentId}/${token}`,
        { responseType: 'blob' }
      );
      
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] 
      });
      const url = window.URL.createObjectURL(blob);
      
      const printWindow = window.open(url);
      printWindow.onload = () => {
        printWindow.print();
        window.URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error('Print failed:', error);
      setError('Failed to print document');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A2E] flex items-center justify-center">
        <div className="text-cyan-400">Verifying access...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A2E] flex flex-col items-center justify-center">
        <img src={logo} alt="Logo" className="h-20 mb-8" />
        <div className="text-red-400 mb-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A2E] text-white">
      <div className="p-6 border-b border-white/10">
        <img src={logo} alt="Logo" className="h-12" />
      </div>

      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white/5 rounded-xl p-8 backdrop-blur-xl">
          <h1 className="text-2xl font-bold mb-6">Print Document</h1>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Document Details</h2>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-white/70">{document?.title}</p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 
              text-white rounded-lg font-medium hover:from-cyan-600 hover:to-purple-600 
              transition-colors"
          >
            Print Document
          </button>

          <p className="text-center text-white/50 text-sm mt-4">
            This is a one-time print access. The link will expire after printing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintView; 