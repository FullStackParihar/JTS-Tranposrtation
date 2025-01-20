
import React from 'react';
import jtslogo from '../components/jtslogo.png'
function Header() {
  return (
    <>
      <header className="bg-white shadow-md sticky top-0 text-gray-700 flex justify-between items-center ">
        <div id='logo' className=""><img className='h-20 px-4 ' src={jtslogo} alt="" /></div>
        <div id="navigations">
          <ul className='flex items-center flex-wrap text-2xl font-semibold gap-5 px-4 sm:flex hidden'>
            <li><a href="">Home</a></li>
            <li><a href="">Services</a></li>
            <li><a href="">Coverage</a></li>
            <li><a href="">Fleet</a></li>
            <li><a href="">Contact</a></li>
            <li><a href="">Get Service</a></li>
          </ul>
        </div>

      </header>
    </>
  );
}

export default Header;
