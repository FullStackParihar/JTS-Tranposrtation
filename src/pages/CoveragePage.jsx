import React from 'react';
import { FaCity, FaTruckMoving, FaMapMarkedAlt, FaRoute, FaClock, FaShieldAlt, FaWarehouse, FaHandshake, FaHeadset, FaPhoneAlt, FaUsers } from 'react-icons/fa';
import nationwide from '../pages/nationalwide.jpg'
import rural from '../pages/rural.jpg'
import urban from '../pages/urban.jpg'
const CoveragePage = () => {
    return (
        <>
            <section className="py-16 bg-[#FFFFFF] text-[#212121]">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-[#6A1B9A]">Our Coverage</h2>
                    <p className="mt-4 text-lg max-w-3xl mx-auto">
                        We proudly serve a vast network across multiple cities and regions, ensuring fresh milk delivery wherever you need it.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-6">
                    <div className="p-6 bg-[#F57C00] rounded-lg shadow-lg text-white">
                        <img src={urban} alt="Urban Areas" className="w-full h-40 rounded-lg object-cover" />
                        <h3 className="text-2xl font-semibold flex items-center mt-4"><FaCity className="mr-2" /> Urban Areas</h3>
                        <p className="mt-2">Reliable milk transportation within city limits with timely deliveries.</p>
                    </div>

                    <div className="p-6 bg-[#F57C00] rounded-lg shadow-lg text-white">
                        <img src={rural} alt="Rural Locations" className="w-full h-40 rounded-lg object-cover" />
                        <h3 className="text-2xl font-semibold flex items-center mt-4"><FaTruckMoving className="mr-2" /> Rural Locations</h3>
                        <p className="mt-2">Reaching remote areas with our specialized fleet and logistics.</p>
                    </div>

                    <div className="p-6 bg-[#F57C00] rounded-lg shadow-lg text-white">
                        <img src={nationwide} alt="Nationwide Reach" className="w-full h-40 rounded-lg object-cover" />
                        <h3 className="text-2xl font-semibold flex items-center mt-4"><FaMapMarkedAlt className="mr-2" /> Nationwide Reach</h3>
                        <p className="mt-2">Expanding our services across the country for larger distribution needs.</p>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <h2 className="text-4xl font-bold text-[#6A1B9A]">Why Choose Our Coverage?</h2>
                    <p className="mt-4 text-lg max-w-3xl mx-auto">
                        Our extensive coverage ensures your dairy products reach the right places at the right time.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto px-6">
                    <div className="p-6 border border-[#6A1B9A] rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold text-[#6A1B9A] flex items-center"><FaRoute className="mr-2" /> Efficient Routing</h3>
                        <p className="mt-2">Optimized routes for faster and more efficient deliveries.</p>
                    </div>

                    <div className="p-6 border border-[#6A1B9A] rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold text-[#6A1B9A] flex items-center"><FaWarehouse className="mr-2" /> Strategic Locations</h3>
                        <p className="mt-2">Warehouses and hubs located strategically for quick access.</p>
                    </div>

                    <div className="p-6 border border-[#6A1B9A] rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold text-[#6A1B9A] flex items-center"><FaClock className="mr-2" /> Real-Time Updates</h3>
                        <p className="mt-2">Stay informed with live tracking and updates on your shipments.</p>
                    </div>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto px-6">
                    <div className="p-6 border border-[#F57C00] rounded-lg shadow-lg bg-[#F57C00] text-white">
                        <h3 className="text-2xl font-semibold flex items-center"><FaShieldAlt className="mr-2" /> Secure Transport</h3>
                        <p className="mt-2">Ensuring your milk products are transported safely and securely.</p>
                    </div>

                    <div className="p-6 border border-[#F57C00] rounded-lg shadow-lg bg-[#F57C00] text-white">
                        <h3 className="text-2xl font-semibold flex items-center"><FaHandshake className="mr-2" /> Trusted Partners</h3>
                        <p className="mt-2">Building long-term relationships with reliable suppliers and clients.</p>
                    </div>

                    <div className="p-6 border border-[#F57C00] rounded-lg shadow-lg bg-[#F57C00] text-white">
                        <h3 className="text-2xl font-semibold flex items-center"><FaHeadset className="mr-2" /> 24/7 Support</h3>
                        <p className="mt-2">Our support team is available anytime to assist with your needs.</p>
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

export default CoveragePage;
