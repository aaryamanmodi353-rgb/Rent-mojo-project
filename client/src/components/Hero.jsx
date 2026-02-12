import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  // Function to handle smooth scrolling
  const scrollToCatalog = () => {
    const element = document.getElementById('catalog');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-indigo-900 text-white overflow-hidden shadow-xl">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Modern Living Room" 
          className="w-full h-full object-cover opacity-40"
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-32 sm:py-40 lg:px-8 flex flex-col items-start text-left">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6">
          Rent Luxury. <br /> Pay Peanuts.
        </h1>
        <p className="mt-4 text-xl text-indigo-100 max-w-2xl mb-10">
          Transform your space with our premium furniture collection. 
          Zero down payment, free relocation, and 24/7 support.
        </p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={scrollToCatalog}
            className="bg-white text-indigo-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition shadow-lg"
          >
            Browse Catalog
          </button>
          <Link 
            to="/register" 
            className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition backdrop-blur-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;