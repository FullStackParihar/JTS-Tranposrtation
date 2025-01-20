
import React from 'react';

function Header() {
  return (
    <>
      <header className="bg-white shadow-md sticky top-0 text-gray-700 p-4  flex justify-between ">
        <div id='logo' className="text-4xl font-bold">JTS</div>
        <div id="navigations">
          <ul className='flex items-center flex-wrap text-2xl gap-5 px-4'>
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
