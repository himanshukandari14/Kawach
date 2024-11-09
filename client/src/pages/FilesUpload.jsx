import React, { useState } from "react";
import Uploading from "../components/Uploading";

const FilesUpload = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).map((file) => ({
      name: file.name,
      size: file.size,
      progress: 0,
    }));
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full h-[100vh] max-w-full mx-auto p-6 md:p-10 bg-gray-900 text-white flex flex-col gap-8 shadow-2xl">
      {/* Upload Box */}
      <div className="w-full p-8 md:p-12 border-2 border-dashed border-blue-400 rounded-lg text-center relative">
        <div className="text-6xl md:text-7xl mb-4 md:mb-6">☁️</div>
        <p className="text-lg md:text-2xl font-semibold">Choose a file or drag & drop it here</p>
        <p className="text-sm md:text-base text-gray-400 mt-2">JPEG, PNG, PDF formats, up to 50MB</p>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <button className="mt-4 md:mt-6 px-6 md:px-8 py-2 md:py-3 bg-blue-500 rounded-lg text-white hover:bg-blue-600 text-base md:text-lg">
          Browse file
        </button>
      </div>

      {/* File List */}
      <div className="space-y-4 md:space-y-6 w-full">
        {files.map((file, index) => (
          <div key={index} className="flex items-center gap-4 md:gap-6 w-full bg-gray-800 p-4 md:p-5 rounded-md">
            {/* File Icon and Info */}
            <div className="flex items-center gap-3 md:gap-4 flex-grow">
              <img src="pdf-icon.png" alt="PDF icon" className="w-12 md:w-16" />
              <div>
                <p className="text-sm md:text-base font-medium">{file.name}</p>
                <p className="text-xs md:text-sm text-gray-400">
                  {Math.min(file.size / 1024, 120).toFixed(1)} KB of 120 KB
                </p>
              </div>
            </div>
            {/* Remove Button */}
            <button
              className="text-gray-400 hover:text-gray-200"
              onClick={() => handleRemoveFile(index)}
            >
              ❌
            </button>
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 h-1 md:h-1.5 rounded mt-1">
              <div
                className="bg-blue-500 h-1 md:h-1.5 rounded"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

        <div className="px-[500px]">
          <Uploading/>
        </div>

      {/* Share Button */}
      <button className="px-6 md:px-8 py-3 md:py-4 bg-blue-500 rounded-lg text-white hover:bg-blue-600 w-full text-center text-base md:text-lg">
        Share
      </button>
    </div>
  );
};

export default FilesUpload;
