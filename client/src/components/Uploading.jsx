import React, { useState, useEffect } from 'react';  
import pdficon from '../assets/pdficon.svg';
import crossicon from '../assets/crossicon.svg';
import Loader from '../assets/loading.svg';
import Line from '../assets/line.svg';

const Uploading = () => {

  const [pdfName, setPdfName] = useState('my-cv.pdf');
  const [pdfSize, setPdfSize] = useState('1.5 MB');

  return (  
    <div className='bg-gradient-to-r from-blue-400 via-green-400 to-teal-300 rounded-xl ' >  
        <div className='flex items-center justify-between px-10 py-3'>
          <img src={pdficon} alt="pdf" />
          <div>
            <h2>{pdfName}</h2>
            <p className='text-gray-400'>{pdfSize}</p>
          </div>
          <img src={crossicon} alt="cross" />
        </div>


        <div>
          <div className='flex items-center justify-end gap-3 mr-5'>
            <img className =' ' src= {Loader}  alt="loading" />
            <p>Uploading...</p>
          </div>
          <img className='w-full' src={Line} alt="" />
        </div>
    </div>  
  );  
};  

export default Uploading;