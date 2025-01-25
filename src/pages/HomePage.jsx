import React from 'react'
import '../pages/mainbg.css'
import truckbg from '../pages/truckbg.png'
import pickuptruck from '../pages/pickuptruck.png'
import accontainer from '../pages/accontainer.png'
import { useToggle } from "../Context/ToggleContext";
import { FaTruck, FaClock, FaShieldAlt, FaMapMarkedAlt } from "react-icons/fa";

const HomePage = () => {
    const { toggle, toggleValue } = useToggle();
    return (
        <div>
            <div id='mainbg' className='relative flex items-center justify-start bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A] h-[38rem] sm:h-[34rem] xs:h-[28rem]'>

                {/* image section */}
                <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center p-8 sm:p-6 xs:p-4'>
                    <div className='text-center'>
                        <h1 className='text-[2rem] sm:text-[2rem] xs:text-[1.5rem] font-extrabold text-[#FFFFFF]'>
                            Reliable Bulk Milk Transportation
                        </h1>
                        <p className='mt-4 text-lg sm:text-base xs:text-sm font-semibold text-[#FFFFFF]'>
                            Delivering fresh milk products safely across cities with our cold-chain logistics
                        </p>
                    </div>
                </div>

                <div id="getbutton" className='absolute w-full bottom-4 flex justify-center'>
                    <button className="bg-gradient-to-r from-[#FF512F] to-[#DD2476] hover:bg-green-700 mt-4 text-white font-roboto px-6 py-3 xs:px-4 xs:py-2 text-base xs:text-sm rounded-lg">
                        Get Service
                    </button>
                </div>
            </div>

            <div id="service" className='py-16 bg- text-[#374151] px-4 sm:px-6'>
                <div className='max-w-7xl mx-auto text-center'>
                    <h2 className="text-[#1E293B] font-poppins text-4xl sm:text-3xl xs:text-2xl font-bold">Our Services</h2>
                    <p className='text-lg sm:text-base xs:text-sm text-[#374151] mt-2'>We provide a range of milk transportation solutions.</p>
                </div>
                <div className='mt-8 grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-10 sm:gap-6 xs:gap-4'>
                    <div className='p-8 border rounded-lg shadow-lg hover:shadow-2xl'>
                        <h3 className='text-2xl sm:text-xl xs:text-lg font-bold text-[#0070F3]'>16ft & 19ft Trucks</h3>
                        <p className='text-[#374151] mt-2 text-sm xs:text-xs'>For larger scale milk product transportation with temperature control</p>
                        <img className='p-12 sm:p-8 xs:p-4' src={truckbg} alt="" />
                    </div>
                    <div className='p-8 border rounded-lg shadow-lg hover:shadow-2xl'>
                        <h3 className='text-xl sm:text-lg xs:text-base font-semibold text-[#0070F3]'>Pickup Trucks</h3>
                        <p className='text-[#374151] text-sm xs:text-xs'>Perfect for smaller bulk deliveries and quick transport.</p>
                        <img className='mt-12 sm:mt-8 xs:mt-4' src={pickuptruck} alt="" />
                    </div>
                    <div className='p-8 border rounded-lg shadow-lg hover:shadow-2xl'>
                        <h3 className='text-xl sm:text-lg xs:text-base font-semibold text-[#0070F3]'>Cold Chain Logistics</h3>
                        <p className='text-[#374151] mt-2 text-sm xs:text-xs'>Ensuring the freshness of milk products during transit</p>
                        <img className='mt-20 sm:mt-12 xs:mt-6 p-6 xs:p-2' src={accontainer} alt="" />
                    </div>
                </div>
            </div>


            <div className="mb-16 flex flex-col md:flex-row items-center justify-center gap-10">
                <div className="bg-white shadow-lg rounded-2xl border-4 border-[#6A1B9A] p-6 max-w-md text-center transform transition duration-500 hover:scale-105 hover:shadow-2xl">
                    <img
                        src="https://img.freepik.com/free-vector/cargo-vehicle-fast-delivery-realistic-composition_1284-19144.jpg?t=st=1737832571~exp=1737836171~hmac=8ce089e70f91254447ce3b72b364bf6edd5b148bfcc2b37c3a86681fbb3ba7b9&w=740"
                        alt="Fast Delivery"
                        className="w-40 h-auto mx-auto mb-4 animate-pulse rounded-full border-4 border-[#F57C00]"
                    />
                    <h2 className="text-3xl font-bold text-[#6A1B9A]">Fast & Reliable Delivery</h2>
                    <p className="text-gray-600 mt-2">
                        We ensure timely and secure transportation of your dairy products with our efficient fleet.
                    </p>
                    <p className="mt-4 text-[#F57C00] font-bold text-lg animate-bounce">
                        Your milk, delivered on time, every time!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg">
                    <div className="bg-[#6A1B9A] text-white p-5 rounded-2xl flex items-center space-x-4 shadow-lg">
                        <FaTruck size={50} className="text-[#F57C00]" />
                        <div>
                            <h3 className="text-xl font-bold">Extensive Fleet</h3>
                            <p>We have a wide range of vehicles for your needs.</p>
                        </div>
                    </div>

                    <div className="bg-[#6A1B9A] text-white p-5 rounded-2xl flex items-center space-x-4 shadow-lg">
                        <FaClock size={50} className="text-[#F57C00]" />
                        <div>
                            <h3 className="text-xl font-bold">On-Time Delivery</h3>
                            <p>We value your time with prompt delivery services.</p>
                        </div>
                    </div>

                    <div className="bg-[#6A1B9A] text-white p-5 rounded-2xl flex items-center space-x-4 shadow-lg">
                        <FaMapMarkedAlt size={50} className="text-[#F57C00]" />
                        <div>
                            <h3 className="text-xl font-bold">Efficient Routing</h3>
                            <p>We value your time with prompt delivery services.</p>
                        </div>
                    </div>

                    <div className="bg-[#6A1B9A] text-white p-5 rounded-2xl flex items-center space-x-4 shadow-lg">
                        <FaShieldAlt size={50} className="text-[#F57C00]" />
                        <div>
                            <h3 className="text-xl font-bold">Secure Transport</h3>
                            <p>Your dairy products are transported with utmost care.</p>
                        </div>
                    </div>
                </div>
            </div>




            <section className="bg-[#6A1B9A] py-16 text-white text-center">
                <h2 className="text-3xl font-bold text-[#FFFFFF]">What Our Clients Say</h2>
                <div className="mt-8 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="p-6 bg-[#F57C00] text-white rounded-lg shadow-lg">
                        <p className="text-lg">"Excellent service and on-time deliveries! Highly recommended."</p>
                        <p className="mt-2 font-bold text-[#212121]">- D mart Ltd.</p>
                    </div>
                    <div className="p-6 bg-[#F57C00] text-white rounded-lg shadow-lg">
                        <p className="text-lg">"Their cold-chain logistics are top-notch. Fresh milk every time!"</p>
                        <p className="mt-2 font-bold text-[#212121]">- keventer icecream Pvt Ltd.</p>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-[#6A1B9A] text-white text-center">
                <h2 className="text-3xl sm:text-4xl font-bold">Get in Touch</h2>
                <p className="mt-4 text-lg sm:text-xl">Have any questions or need a quote? Reach out to us!</p>
                <form className="mt-8 max-w-md sm:max-w-lg mx-auto px-4 sm:px-0">
                    <input
                        type="text"
                        placeholder="Your Name"
                        className="p-4 w-full mb-4 rounded-lg text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#F57C00] transition duration-300"
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        className="p-4 w-full mb-4 rounded-lg text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#F57C00] transition duration-300"
                    />
                    <textarea
                        placeholder="Your Message"
                        className="p-4 w-full mb-4 rounded-lg text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#F57C00] transition duration-300"
                        rows="4"
                    ></textarea>
                    <button
                        type="submit"
                        className="bg-[#F57C00] hover:bg-[#D65A00] text-white px-6 py-3 rounded-lg w-full sm:w-auto transition duration-300"
                    >
                        Send Message
                    </button>
                </form>
            </section>





            <section className="bg-gradient-to-r from-[#FF512F] to-[#DD2476] py-12 sm:py-8 xs:py-6 text-center text-white px-4">
                <h2 className="text-3xl sm:text-2xl xs:text-xl font-bold">Ready to Transport with Us?</h2>
                <p className="mt-4 sm:mt-2 xs:mt-1 text-lg sm:text-base xs:text-sm">Get in touch and request a quote today.</p>
                <a href="#quote" className="mt-6 inline-block bg-[#FFD700] text-[#002B5B] font-semibold px-8 sm:px-6 xs:px-4 py-3 sm:py-2 xs:py-1 rounded-lg hover:bg-[#FFECB3]">
                    Request a Quote
                </a>
            </section>

            <section className="bg-white py-16 text-center">
                <h2 className="text-3xl font-bold text-[#6A1B9A]">About Us</h2>
                <p className="mt-4 max-w-3xl mx-auto text-[#212121]">
                    With 5 years of experience in bulk milk transportation, Jagdamba Transport Services ensures
                    the safest and most efficient delivery for your dairy products.
                </p>
            </section>


            <footer className="bg-[#0A2540] text-[#F4F4F4] py-8 sm:py-6 xs:py-4 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row sm:flex-col xs:flex-col justify-between">
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg font-bold text-white">Jagdamba Transport Services</h3>
                        <p className="mt-2 text-sm xs:text-xs">Delivering fresh dairy products across India.</p>
                    </div>
                    <div className="mt-4 sm:mt-0 xs:mt-2 text-center sm:text-left">
                        <p className="text-sm xs:text-xs">Contact: +91 12345 67890</p>
                        <p className="text-sm xs:text-xs">Email: jagdambatransport@gmail.com</p>
                    </div>
                    <div className="mt-4 sm:mt-0 xs:mt-2 flex space-x-4 justify-center sm:justify-start">
                        <a href="#" className="hover:text-[#FFA500] text-sm xs:text-xs">Facebook</a>
                        <a href="#" className="hover:text-[#FFA500] text-sm xs:text-xs">Instagram</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default HomePage;
