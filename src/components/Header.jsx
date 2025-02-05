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
        <Link to="/">  <div id='logo' className="flex items-center">
          <img className='h-16 md:h-20' src={jtslogo} alt="Jagdamba Transport Logo" />
          <h2 className={`text-xl md:text-2xl font-oswald font-extrabold ${isScrolled ? 'text-[#6A1B9A] ' : 'text-[#F57C00]'} leading-snug sm:leading-tight text-center sm:text-left whitespace-nowrap`}>
            Jagdamba Transport Services
          </h2>
        </div></Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex">
          <ul className={`flex items-center font-poppins text-lg md:text-xl transition-all duration-600 font-semibold gap-6 ${isScrolled ? 'text-[#F57C00]' : 'text-[#6A1B9A]'}`}>
            <li><Link to="/" className='hover:bg-[#6A1B9A] p-2 px-4 rounded-full hover:text-white'>Home</Link></li>
            <li><Link to="/services" className='hover:bg-[#6A1B9A] p-2 px-4 rounded-full hover:text-white'>Services</Link></li>
            <li><Link to="/coverage" className='hover:bg-[#6A1B9A] p-2 px-4 rounded-full hover:text-white duration-300'>Coverage</Link></li>
            <li><Link to="/fleet" className='hover:bg-[#6A1B9A] p-2 px-4 rounded-full hover:text-white'>Fleet</Link></li>
            <li className={`${isScrolled ? 'bg-[#6A1B9A] text-white' : 'bg-[#F57C00] text-white'} p-2 px-6 rounded-full`}>
              <Link to="/contact">Contact</Link>
            </li>
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
              <Link to="/" onClick={() => setIsToggled(false)}>
                <li className="p-3 bg-white text-[#6A1B9A] hover:bg-[#F57C00] hover:text-white animation border-[0.5px]">Home</li>
              </Link>
              <Link to="/services" onClick={() => setIsToggled(false)}>
                <li className="p-3 bg-white text-[#6A1B9A] hover:bg-[#F57C00] hover:text-white animation border-[0.5px]">Services</li>
              </Link>
              <Link to="/coverage" onClick={() => setIsToggled(false)}>
                <li className="p-3 bg-white text-[#6A1B9A] hover:bg-[#F57C00] hover:text-white animation border-[0.5px]">Coverage</li>
              </Link>
              <Link to="/fleet" onClick={() => setIsToggled(false)}>
                <li className="p-3 bg-white text-[#6A1B9A] hover:bg-[#F57C00] hover:text-white animation border-[0.5px]">Fleet</li>
              </Link>
              <Link to="/contact" onClick={() => setIsToggled(false)}>
                <li className="p-3 bg-white text-[#6A1B9A] hover:bg-[#F57C00] hover:text-white animation border-[0.5px]">Contact</li>
              </Link>
            </ul>

          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
