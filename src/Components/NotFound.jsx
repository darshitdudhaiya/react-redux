import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';

function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#201E43] text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">Oops! The page you're looking for doesn't exist.</p>
      <img 
        src="https://via.placeholder.com/400x300?text=404+Not+Found" 
        alt="404 Not Found" 
        className="mb-4"
      />
      <Link to="/">
        <Button className="bg-[#508C9B] hover:bg-[#417482] focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 text-center">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;
