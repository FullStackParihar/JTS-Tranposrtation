import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import jtslogo from '../components/jtslogo.png';
import { FaBars } from "react-icons/fa";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsToggled(false);
      }
    };

    if (isToggled) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isToggled]);

  return (
    <>
   <header className={`fixed w-full z-99 top-0 flex justify-between items-center transition-all duration-300 px-4 md:px-8 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
    <div id='logo' className="flex items-center">
        <img className='h-16 md:h-20' src={jtslogo} alt="Jagdamba Transport Logo" />
        <h2 className={`text-lg md:text-2xl font-bold ${isScrolled ? 'text-[#6A1B9A] ' : 'text-[#F57C00]'} leading-snug sm:leading-tight text-center sm:text-left whitespace-nowrap`}>
            Jagdamba Transport Services
        </h2>
    </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex">
          <ul className='flex items-center font-poppins text-gray-800 text-lg md:text-xl font-semibold gap-6'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/coverage">Coverage</Link></li>
            <li><Link to="/fleet">Fleet</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/get-service">Get Service</Link></li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden block relative">
          <button
            ref={buttonRef}
            aria-label="Open menu"
            onClick={() => setIsToggled((prev) => !prev)}
          >
            <FaBars className="text-4xl text-gray-800" />
          </button>

          {/* Mobile Menu */}
          <div
            ref={menuRef}
            className={`absolute right-0 top-14 w-48 bg-white shadow-lg rounded-lg z-50 transition-transform duration-300 ease-in-out ${isToggled ? 'scale-100' : 'scale-0'
              }`}
          >
            <ul className="flex flex-col text-gray-800 font-semibold text-lg">
              <li className="p-3 bg-white text-[#6A1B9A] hover:bg-[#F57C00] hover:text-white animation border-[0.5px]"><Link to="/">Home</Link></li>
              <li className="p-3 bg-white text-[#6A1B9A] hover:bg-[#F57C00] hover:text-white animation border-[0.5px]"><Link to="/services">Services</Link></li>
              <li className="p-3 bg-white text-[#6A1B9A] hover:bg-[#F57C00] hover:text-white animation border-[0.5px]"><Link to="/coverage">Coverage</Link></li>
              <li className="p-3 bg-white text-[#6A1B9A] hover:bg-[#F57C00] hover:text-white animation border-[0.5px]"><Link to="/fleet">Fleet</Link></li>
              <li className="p-3 bg-white text-[#6A1B9A] hover:bg-[#F57C00] hover:text-white animation border-[0.5px]"><Link to="/contact">Contact</Link></li>
              <li className="p-3 bg-white text-[#6A1B9A] hover:bg-[#F57C00] hover:text-white animation border-[0.5px]"><Link to="/get-service">Get Service</Link></li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
