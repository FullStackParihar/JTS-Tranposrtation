import React, { useState, useEffect } from 'react';
import jtslogo from '../components/jtslogo.png';
import { FaBars } from "react-icons/fa";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed w-full top-0 flex justify-between items-center transition-all duration-300 px-2 md:px-8 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div id='logo' className="flex items-center">
          <img
            className='h-20'
            src={jtslogo}
            alt="Jagdamba Transport Logo" />
          <h2
            className='text-[2rem]] md:text-2xl font-bold text-pink-700 leading-snug sm:leading-tight text-center sm:text-left whitespace-nowrap'>
            Jagdamba Transport Services
          </h2>
        </div>

        <div id="navigations" className="hidden lg:flex">
          <ul className='flex items-center font-poppins text-gray-800 text-2xl md:text-xl sm:text-lg xs:text-base font-semibold gap-5'>
            <li><a href="">Home</a></li>
            <li><a href="">Services</a></li>
            <li><a href="">Coverage</a></li>
            <li><a href="">Fleet</a></li>
            <li><a href="">Contact</a></li>
            <li><a href="">Get Service</a></li>
          </ul>
        </div>

        <div className="p-4 lg:hidden block">
          <button aria-label="Open menu"><FaBars className="text-4xl sm:text-3xl xs:text-2xl" /></button>
        </div>
      </header>
    </>
  );
}

export default Header;
