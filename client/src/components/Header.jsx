import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg max-w-sm mx-auto">
      <div className="flex items-center mb-4">
        <div className="bg-gray-700 rounded-full w-9 h-9 flex items-center justify-center">
          <span className="text-xl">👤</span>
        </div>
        <div className="ml-2">
          <div>Hi NAME</div>
          <div className="text-sm text-gray-400">Good morning</div>
        </div>
        <button className="ml-auto bg-teal-500 text-white p-2 rounded-full">
          ➕
        </button>
      </div>
      <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-4 rounded-lg mb-4">
        <div className="text-gray-800">Upload files</div>
        <div className="text-sm text-gray-600">Select and upload the files of your choice</div>
      </div>
      <div className="mb-4">
        <div className="flex space-x-4">
          <button className="text-teal-400">My Doc</button>
          <button className="text-gray-500">PDF</button>
          <button className="text-gray-500">DOCUMENT</button>
          <button className="text-gray-500">FILES</button>
          <button className="text-gray-500">GOV</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg h-24"></div>
        <div className="bg-gray-800 p-4 rounded-lg h-24"></div>
        <div className="bg-gray-800 p-4 rounded-lg h-24"></div>
        <div className="bg-gray-800 p-4 rounded-lg h-24"></div>
      </div>
    </div>
  );
};

export default Dashboard;
