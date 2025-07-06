import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import jtslogo from '../components/jtslogo.png';
import { FaBars, FaUser, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";

function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const userMenuRef = useRef(null);

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

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    if (isToggled || showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isToggled, showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleDashboardClick = () => {
    setShowUserMenu(false);
    navigate('/dashboard');
  };

  return (
    <>
      <header className={`fixed w-full z-50 top-0 flex justify-between items-center transition-all duration-300 px-4 md:px-8 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <Link to="/">
          <div id='logo' className="flex items-center">
            <img className='h-16 md:h-20' src={jtslogo} alt="Jagdamba Transport Logo" />
            <h2 className={`text-xl md:text-2xl font-oswald font-extrabold ${isScrolled ? 'text-[#6A1B9A] ' : 'text-[#F57C00]'} leading-snug sm:leading-tight text-center sm:text-left whitespace-nowrap`}>
              Jagdamba Transport Services
            </h2>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <ul className={`flex items-center font-poppins text-lg md:text-xl transition-all duration-600 font-semibold gap-6 ${isScrolled ? 'text-[#F57C00]' : 'text-[#6A1B9A]'}`}>
            <li><Link to="/" className='hover:bg-[#6A1B9A] p-2 px-4 rounded-full hover:text-white'>Home</Link></li>
            <li><Link to="/services" className='hover:bg-[#6A1B9A] p-2 px-4 rounded-full hover:text-white'>Services</Link></li>
            <li><Link to="/coverage" className='hover:bg-[#6A1B9A] p-2 px-4 rounded-full hover:text-white duration-300'>Coverage</Link></li>
            <li><Link to="/fleet" className='hover:bg-[#6A1B9A] p-2 px-4 rounded-full hover:text-white'>Fleet</Link></li>
            <li><Link to="/contact" className='hover:bg-[#6A1B9A] p-2 px-4 rounded-full hover:text-white'>Contact</Link></li>
            <li><Link to="/admin" className='hover:bg-[#6A1B9A] p-2 px-4 rounded-full hover:text-white'>Admin</Link></li>
          </ul>

          {/* Auth Section */}
          <div className="ml-6">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 ${isScrolled ? 'bg-[#6A1B9A] text-white' : 'bg-[#F57C00] text-white'} p-2 px-4 rounded-full hover:opacity-90`}
                >
                  <FaUser />
                  <span>{user?.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-lg z-50">
                    <div className="py-2">
                      <button
                        onClick={handleDashboardClick}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                      >
                        <FaTachometerAlt className="mr-2" />
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className={`${isScrolled ? 'bg-[#6A1B9A] text-white' : 'bg-[#F57C00] text-white'} p-2 px-6 rounded-full hover:opacity-90`}
              >
                Sign In
              </button>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden block relative">
          <button
            ref={buttonRef}
            aria-label="Open menu"
            onClick={() => setIsToggled((prev) => !prev)}
          >
            <FaBars className="text-4xl text-[#6A1B9A]" />
          </button>

          {/* Mobile Menu */}
          <div
            id='menubar'
            ref={menuRef}
            className={`absolute right-0 top-14 w-48 bg-white shadow-lg rounded-lg z-50 transition-transform duration-300 ease-in-out ${isToggled ? 'scale-100' : 'scale-0'}`}
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
              
              {/* Mobile Auth */}
              <div className="border-t border-gray-200 mt-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        setIsToggled(false);
                        navigate('/dashboard');
                      }}
                      className="w-full text-left p-3 bg-white text-[#6A1B9A] hover:bg-[#F57C00] hover:text-white animation border-[0.5px]"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setIsToggled(false);
                        handleLogout();
                      }}
                      className="w-full text-left p-3 bg-white text-[#6A1B9A] hover:bg-[#F57C00] hover:text-white animation border-[0.5px]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsToggled(false);
                      setShowAuthModal(true);
                    }}
                    className="w-full text-left p-3 bg-white text-[#6A1B9A] hover:bg-[#F57C00] hover:text-white animation border-[0.5px]"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </ul>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

export default Header;