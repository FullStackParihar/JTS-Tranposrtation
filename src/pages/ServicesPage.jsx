import React from 'react';
import truckbg from '../pages/truckbg.png'
import pickuptruck from '../pages/pickuptruck.png'
import accontainer from '../pages/accontainer.png'
import Loading from '../pages/Loading.jpg'
import supply from '../pages/supply.jpg'
import customplan3 from '../pages/customplan3.jpg'
import { FaTruck, FaWarehouse, FaCogs, FaPhoneAlt, FaMapMarkedAlt, FaUsers } from 'react-icons/fa';

const ServicesPage = () => {
    return (
        <>
            <section className="py-16 bg-[#FFFFFF] text-[#212121]">
                <div className="text-center">
                    <h2 className="text-5xl font-extrabold text-[#6A1B9A] leading-tight">Our Premium Services</h2>
                    <p className="mt-4 text-lg max-w-3xl mx-auto text-gray-600">
                        We offer a range of transportation and logistics solutions designed to ensure the safe and timely delivery of your milk products.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-6">
                    <div className="p-6 bg-[#F57C00] rounded-lg shadow-lg text-white flex flex-col items-center">
                        <img src={truckbg} alt="16ft & 19ft Trucks" className="w-full h-full object-contain rounded-lg" />
                        <FaTruck className="text-4xl mt-4" />
                        <h3 className="text-2xl font-semibold mt-4">16ft & 19ft Trucks</h3>
                        <p className="mt-2">Ideal for large-scale milk product transportation with climate control features.</p>
                    </div>

                    <div className="p-6 bg-[#F57C00] rounded-lg shadow-lg text-white flex flex-col items-center">
                        <img src={pickuptruck} alt="Pickup Trucks" className="w-full h-full object-contain rounded-lg " />
                        <FaTruck className="text-4xl mt-4" />
                        <h3 className="text-2xl font-semibold mt-4">Pickup Trucks</h3>
                        <p className="mt-2">Perfect for smaller bulk deliveries and fast transportation solutions.</p>
                    </div>

                    <div className="p-6 bg-[#F57C00] rounded-lg shadow-lg text-white flex flex-col items-center">
                        <img src={accontainer} alt="Cold Chain Logistics" className="w-full h-full drop-shadow-2xl object-contain rounded-lg" />
                        <FaCogs className="text-4xl mt-4" />
                        <h3 className="text-2xl font-semibold mt-4">Cold Chain Logistics</h3>
                        <p className="mt-2">Ensure your milk products stay fresh with our advanced refrigeration technology.</p>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <h2 className="text-5xl font-extrabold text-[#6A1B9A]">Additional Solutions</h2>
                    <p className="mt-4 text-lg max-w-3xl mx-auto text-gray-600">
                        Beyond transportation, we offer value-added services to streamline your logistics.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto px-6">
                    <div className="p-6 border border-[#6A1B9A] rounded-lg shadow-lg flex flex-col items-center">
                        <img src={Loading} alt="Bulk Pickup" className="w-full h-32 object-cover rounded-lg" />
                        <FaTruck className="text-4xl mt-4 text-[#6A1B9A]" />
                        <h3 className="text-2xl font-semibold text-[#6A1B9A] mt-4">Bulk Pickup</h3>
                        <p className="mt-2">Efficient pickup from dairies and providers to ensure timely deliveries.</p>
                    </div>

                    <div className="p-6 border border-[#6A1B9A] rounded-lg shadow-lg flex flex-col items-center">
                        <img src={supply} alt="Supply Chain Management" className="w-full h-32 object-cover rounded-lg" />
                        <FaMapMarkedAlt className="text-4xl mt-4 text-[#6A1B9A]" />
                        <h3 className="text-2xl font-semibold text-[#6A1B9A] mt-4">Supply Chain Management</h3>
                        <p className="mt-2">End-to-end solutions to optimize your logistics operations, from pickup to delivery.</p>
                    </div>

                    <div className="p-6 border border-[#6A1B9A] rounded-lg shadow-lg flex flex-col items-center">
                        <img src={customplan3} alt="Custom Transport Plans" className="w-full h-32 object-cover rounded-lg" />
                        <FaCogs className="text-4xl mt-4 text-[#6A1B9A]" />
                        <h3 className="text-2xl font-semibold text-[#6A1B9A] mt-4">Custom Transport Plans</h3>
                        <p className="mt-2">Tailored transportation solutions designed to meet your specific needs.</p>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <h2 className="text-5xl font-extrabold text-[#6A1B9A]">Why Choose Us?</h2>
                    <p className="mt-4 text-lg max-w-3xl mx-auto text-gray-600">
                        Our commitment to quality, reliability, and timely service sets us apart in the industry.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto px-6">
                    <div className="p-6 border border-[#6A1B9A] rounded-lg shadow-lg flex flex-col items-center">
                        <FaPhoneAlt className="text-4xl mt-4 text-[#6A1B9A]" />
                        <h3 className="text-2xl font-semibold text-[#6A1B9A] mt-4">24/7 Customer Support</h3>
                        <p className="mt-2">We’re available around the clock to address your needs.</p>
                    </div>

                    <div className="p-6 border border-[#6A1B9A] rounded-lg shadow-lg flex flex-col items-center">
                        <FaMapMarkedAlt className="text-4xl mt-4 text-[#6A1B9A]" />
                        <h3 className="text-2xl font-semibold text-[#6A1B9A] mt-4">Real-Time GPS Tracking</h3>
                        <p className="mt-2">Track your shipments live with our cutting-edge GPS system.</p>
                    </div>

                    <div className="p-6 border border-[#6A1B9A] rounded-lg shadow-lg flex flex-col items-center">
                        <FaUsers className="text-4xl mt-4 text-[#6A1B9A]" />
                        <h3 className="text-2xl font-semibold text-[#6A1B9A] mt-4">Experienced Team</h3>
                        <p className="mt-2">Our skilled professionals ensure your deliveries are smooth and efficient.</p>
                    </div>
                </div>

            </section>
            <footer className="bg-[#212121] text-white py-8 text-center">
                <div className="max-w-6xl mx-auto px-6">
                    <p className="text-lg">&copy; 2024 Jagdamba Transport Services. All rights reserved.</p>
                    <p className="mt-2">Contact us at <a href="mailto:info@jagdambatransport.com" className="text-[#F57C00]">info@jagdambatransport.com</a></p>
                    <div className="flex justify-center gap-6 mt-4">
                        <FaPhoneAlt className="text-[#F57C00] text-2xl" />
                        <FaMapMarkedAlt className="text-[#F57C00] text-2xl" />
                        <FaUsers className="text-[#F57C00] text-2xl" />
                    </div>
                </div>
            </footer>
        </>
    );
};

export default ServicesPage;
