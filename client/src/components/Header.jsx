import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg max-full mx-auto">
      <div className="flex items-center mb-10 mt-10">
        <div className="bg-gray-700 rounded-full w-9 h-9 flex items-center justify-center">
          <span className="text-xl">👤</span>
        </div>
        <div className="ml-2">
          <div>Hi NAME</div>
          <div className="text-sm text-gray-400">Good morning</div>
        </div>
        <button className='absolute right-16 bg-teal-500 text-white p-2 font-semibold rounded-full'>Log out</button>
        <button className="ml-auto bg-teal-500 text-white p-2 rounded-full">
          ➕
        </button>
      </div>
      <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-4 rounded-lg mb-4">
        <div className="text-gray-800">Upload files</div>
        <div className="text-sm text-gray-600">Select and upload the files of your choice</div>
      </div>
      <div className="mb-4">
        <button className="text-black font-semibold p-1 rounded-md bg-green-400 mb-2 md:mb-0">My Doc</button>
        <div className="flex flex-wrap space-x-4">
          <button className="text-gray-500">PDF</button>
          <button className="text-gray-500">DOCUMENT</button>
          <button className="text-gray-500">FILES</button>
          <button className="text-gray-500">GOV</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg h-32"></div>
        <div className="bg-gray-800 p-4 rounded-lg h-32"></div>
        <div className="bg-gray-800 p-4 rounded-lg h-32"></div>
        <div className="bg-gray-800 p-4 rounded-lg h-32"></div>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg h-24 mt-4"></div>
      <div className="bg-gray-800 p-4 rounded-lg h-24 mt-4"></div>
      <div className="bg-gray-800 p-4 rounded-lg h-24 mt-4"></div>
    </div>
  );
};

export default Dashboard;
