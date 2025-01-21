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
      <header className={`fixed w-full top-0 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div id='logo' className="flex justify-start items-center ">
          <img className='h-20 pl-4 ' src={jtslogo} alt="" />
          <h2 className='text-2xl font-bold text-pink-700'>Jagdamba Transport Services</h2>
        </div>
        <div id="navigations">
          <ul className='flex items-center flex-wrap font-poppins text-gray-800 text-2xl font-semibold gap-5 px-4 lg:flex hidden'>
            <li>
              <a href="">Home</a>
            </li>
            <li>
              <a href="">Services</a>
            </li>
            <li>
              <a href="">Coverage</a>
            </li>
            <li>
              <a href="">Fleet</a>
            </li>
            <li>
              <a href="">Contact</a>
            </li>
            <li>
              <a href="">Get Service</a>
            </li>
          </ul>
        </div>
        <div className="p-4 lg:hidden block">
          <a href=""><FaBars className="text-4xl" /></a>
        </div>

      </header>
    </>
  );
}

export default Header;
