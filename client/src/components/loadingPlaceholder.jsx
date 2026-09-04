import React from 'react';
import { BiLoaderAlt } from 'react-icons/bi'; // npm install react-icons agar ye icon nahi hai toh

const LoadingPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-[#251e3c] rounded-lg w-[320px] h-[320px] shadow-lg">
      <BiLoaderAlt className="animate-spin text-5xl text-[#6d28d9] mb-4" />
      <p className="text-sm text-gray-400">Processing Your AI Image...</p>
    </div>
  );
};

export default LoadingPlaceholder;