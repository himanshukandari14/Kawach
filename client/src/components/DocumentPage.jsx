import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DocumentPage = () => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/documents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setDocument(response.data.document);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch document');
        setLoading(false);
      }
    };

    if (token && id) {
      fetchDocument();
    }
  }, [token, id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!document) {
    return <div className="text-center mt-4">Document not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{document.fileName}</h1>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Document Details</h2>
          <p><span className="font-medium">Upload Date:</span> {new Date(document.uploadDate).toLocaleDateString()}</p>
          <p><span className="font-medium">File Type:</span> {document.fileType}</p>
          <p><span className="font-medium">File Size:</span> {Math.round(document.fileSize / 1024)} KB</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">QR Codes</h2>
          {document.qrCodes && document.qrCodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {document.qrCodes.map((qr) => (
                <div key={qr._id} className="border p-4 rounded">
                  <p><span className="font-medium">Created:</span> {new Date(qr.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Status:</span> {qr.isValid ? 'Valid' : 'Invalid'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No QR codes generated for this document</p>
          )}
        </div>

        <div className="flex gap-4">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => window.open(document.fileUrl, '_blank')}
          >
            View Document
          </button>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => {/* Add QR code generation logic */}}
          >
            Generate New QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
