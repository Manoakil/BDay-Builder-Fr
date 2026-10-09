import React from 'react';
import brandSpinner from '../assets/brand-spinner.mp4';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-900 font-sans flex flex-col min-h-screen">
      <main className="flex-grow flex items-center">
        <div className="max-w-6xl mx-auto px-6 py-16 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col items-start space-y-4">
            <p className="text-xl font-bold tracking-tight text-gray-900">
              Ooops...
            </p>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Sorry, we can't<br />find that page
            </h1>
            <div className="pt-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-sm font-semibold text-[#FF00BF] hover:underline transition"
              >
                <span className="mr-2">&larr;</span> Back
              </button>
            </div>
          </div>

          {/* Right Car Roundabout Animation */}
          <div className="flex justify-center md:justify-end">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-lg object-contain pointer-events-none"
            >
              <source src={brandSpinner} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </main>
    </div>
  );
}
