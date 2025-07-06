// import React, { useEffect, useState } from "react";
// import fleetData from "../utility/FleetData";
// import { FaTruck, FaSearch, FaQuoteLeft, FaMapMarkerAlt } from "react-icons/fa";
// import '../pages/mainbg.css'
// const Fleet = () => {
//     const [searchTerm, setSearchTerm] = useState("");

//     const [isLoaded, setisLoaded] = useState(true);
    
//         useEffect(()=>{
    
//             const timer= setTimeout(()=> setisLoaded(false),1000);
//             return ()=> clearTimeout(timer);
//         },[]);

//     // Filter fleet data based on the search term
//     const filteredFleetData = fleetData.filter((vehicle) =>
//         vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         vehicle.capacity.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="bg-[#6A1B9A] min-h-screen py-6 px-5">
//             <h1 className="text-4xl font-bold text-center text-[#F57C00] mt-10 mb-2">Our Fleet</h1>
//             <p className="text-center text-white text-lg mb-8">We have more vehicles like this to serve your needs.</p>

//             {/* Search Bar */}
//             <div className="mb-10 text-center">
//                 <input
//                     type="text"
//                     placeholder="Search by vehicle name & capacity..."
//                     className="py-2 px-6 border-2 border-[#6A1B9A] rounded-lg"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <FaSearch className="inline-block ml-2 text-2xl text-[#F57C00] cursor-pointer" />
//             </div>

//             {/* Fleet Cards */}
//             <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// {isLoaded ?
//                 filteredFleetData.map((vehicle) => (
//                     <div
                        
//                          className="bg-[#F57C00] shadow-lg rounded-3xl overflow-hidden animate-pulse border-4 border-[#6A1B9A] transform transition duration-500 hover:scale-105 hover:shadow-2xl"
//                     >
//                         <img  className="w-full h-60 object-cover" />
//                         <div className="p-6 bg-white h-44 rounded-b-2xl">
//                             <h2 className="text-2xl font-semibold text-[#6A1B9A]"> </h2>
//                             <p className="text-gray-600 mt-2"></p>
//                             <p className="mt-4 text-[#F57C00] font-bold"> </p>
//                         </div>
//                     </div>
//                 ))

//                : filteredFleetData.map((vehicle) => (
//                     <div id='delivery'
//                         key={vehicle.id}
//                         className="bg-[#F57C00] shadow-lg rounded-3xl overflow-hidden border-4 border-[#6A1B9A] transform transition duration-500 hover:scale-105 hover:shadow-2xl"
//                     >
//                         <img src={vehicle.image} alt={vehicle.name} className="w-full h-60 object-cover" />
//                         <div className="p-6 bg-white rounded-b-2xl">
//                             <h2 className="text-2xl font-semibold text-[#6A1B9A]">{vehicle.name}</h2>
//                             <p className="text-gray-600 mt-2">{vehicle.description}</p>
//                             <p className="mt-4 text-[#F57C00] font-bold">Capacity: {vehicle.capacity}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Customer Testimonials */}
//             <div className="mt-12 bg-[#7325a4] shadow-lg text-white py-10 px-5 rounded-lg">
//                 <h2 className="text-3xl font-semibold text-center mb-6">What Our Clients Say</h2>
//                 <div id='delivery' className="flex flex-wrap justify-center gap-8">
//                     <div className="max-w-xs bg-white text-[#6A1B9A] rounded-lg p-6 shadow-lg">
//                         <p className="text-lg italic mb-4">
//                             "The service was prompt and professional! We trust Jagdamba Transport for all our bulk milk shipments."
//                         </p>
//                         <p className="font-semibold">Ravi S., Dairy Supplier</p>
//                     </div>
//                     <div id='delivery' className="max-w-xs bg-white text-[#6A1B9A] rounded-lg p-6 shadow-lg">
//                         <p className="text-lg italic mb-4">
//                             "Excellent fleet management and reliable services every time! Highly recommend."
//                         </p>
//                         <p className="font-semibold">Priya K., Transport Coordinator</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Call to Action Section */}
//             <div id='delivery' className="mt-12 bg-[#212121] text-white py-10 px-5 rounded-lg text-center">
//                 <h2 className="text-3xl font-semibold mb-6">Ready to Ship?</h2>
//                 <p className="text-lg mb-6">Contact us today to book your next bulk milk transportation service. Our fleet is ready to handle your needs.</p>
//                 <button id='delivery' className="bg-[#F57C00] text-[#6A1B9A] px-6 py-3 rounded-lg shadow-lg transition duration-300 hover:bg-[#6A1B9A] hover:text-white">
//                     Get a Quote <FaQuoteLeft className="inline-block ml-2" />
//                 </button>
//             </div>

//             {/* Track Your Vehicle Section */}
//             <div id='delivery' className="mt-12 bg-white text-[#6A1B9A] py-10 px-5 rounded-lg">
//                 <h2 className="text-3xl font-semibold text-center mb-6">Track Your Vehicle</h2>
//                 <p className="text-lg text-center mb-6">
//                     Stay updated with the status of your transport. Enter your vehicle ID to track your shipment. Powered by Weelseye for live tracking.
//                 </p>
//                 <div className="flex justify-center">
//                     <input id='delivery'
//                         type="text"
//                         placeholder="Enter Vehicle ID"
//                         className="py-2 px-6 border-2 border-[#6A1B9A] rounded-lg mr-4"
//                     />
//                     <button id='delivery' className="bg-[#F57C00] text-white px-6 py-2 rounded-lg shadow-lg">
//                         Track <FaMapMarkerAlt className="inline-block ml-2" />
//                     </button>
//                 </div>
//             </div>

//             {/* More Information Section */}
//             <div className="mt-12 bg-[#6A1B9A] text-white py-8 px-5 rounded-lg">
//                 <h2 className="text-3xl font-semibold text-center mb-6">Why Choose Us?</h2>
//                 <p className="text-lg text-center">
//                     At Jagdamba Transport Services, we ensure timely and safe transportation of bulk milk products. Our fleet is equipped to handle large loads and is maintained to the highest standards. Whether you're a dairy provider or need reliable transport, our fleet is ready to serve your needs.
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Fleet;

import React, { useEffect, useState } from "react";
import axios from "axios";
import baseurl from "../utility/baseurl";
import { FaSearch, FaQuoteLeft, FaMapMarkerAlt } from "react-icons/fa";
import '../pages/mainbg.css';

const Fleet = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [fleetData, setFleetData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(true);

    useEffect(() => {
        // Fetch fleet data from backend
        const fetchFleet = async () => {
            try {
                const res = await axios.get(`${baseurl}/api/vehicles`);
                setFleetData(res.data);
                console.log("Fleet data fetched successfully:", res.data);
            } catch (err) {
                setFleetData([]);
            }
        };
        fetchFleet();

        const timer = setTimeout(() => setIsLoaded(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Filter fleet data based on the search term
    const filteredFleetData = fleetData.filter((vehicle) =>
        vehicle.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(vehicle.capacity).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[#6A1B9A] min-h-screen py-6 px-5">
            <h1 className="text-4xl font-bold text-center text-[#F57C00] mt-10 mb-2">Our Fleet</h1>
            <p className="text-center text-white text-lg mb-8">We have more vehicles like this to serve your needs.</p>

            {/* Search Bar */}
            <div className="mb-10 text-center">
                <input
                    type="text"
                    placeholder="Search by truck number, type, or capacity..."
                    className="py-2 px-6 border-2 border-[#6A1B9A] rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="inline-block ml-2 text-2xl text-[#F57C00] cursor-pointer" />
            </div>

            {/* Fleet Cards */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoaded
                    ? Array(3).fill(0).map((_, idx) => (
                        <div
                            key={idx}
                            className="bg-[#F57C00] shadow-lg rounded-3xl overflow-hidden animate-pulse border-4 border-[#6A1B9A] transform transition duration-500 hover:scale-105 hover:shadow-2xl"
                        >
                            <div className="w-full h-60 bg-gray-300" />
                            <div className="p-6 bg-white h-44 rounded-b-2xl" />
                        </div>
                    ))
                    : filteredFleetData.map((vehicle) => (
                        <div
                            key={vehicle._id}
                            className="bg-[#F57C00] shadow-lg rounded-3xl overflow-hidden border-4 border-[#6A1B9A] transform transition duration-500 hover:scale-105 hover:shadow-2xl"
                        >
                            <img
                                src={vehicle.image }
                                alt={vehicle.number}
                                className="w-full h-60 object-cover"
                            />
                            <div className="p-6 bg-white rounded-b-2xl">
                                <h2 className="text-2xl font-semibold text-[#6A1B9A]">{vehicle.number}</h2>
                                <p className="text-gray-600 mt-2">Type: {vehicle.type}</p>
                                <p className="text-gray-600 mt-2">Wheels: {vehicle.wheels}</p>
                                <p className="text-gray-600 mt-2">Year: {vehicle.year}</p>
                                <p className="text-gray-600 mt-2">Registration: {vehicle.registrationNumber}</p>
                                <p className="text-gray-600 mt-2">Owner: {vehicle.ownerContact}</p>
                                <p className="mt-4 text-[#F57C00] font-bold">Capacity: {vehicle.capacity} litres</p>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Customer Testimonials */}
            <div className="mt-12 bg-[#7325a4] shadow-lg text-white py-10 px-5 rounded-lg">
                <h2 className="text-3xl font-semibold text-center mb-6">What Our Clients Say</h2>
                <div id='delivery' className="flex flex-wrap justify-center gap-8">
                    <div className="max-w-xs bg-white text-[#6A1B9A] rounded-lg p-6 shadow-lg">
                        <p className="text-lg italic mb-4">
                            "The service was prompt and professional! We trust Jagdamba Transport for all our bulk milk shipments."
                        </p>
                        <p className="font-semibold">Ravi S., Dairy Supplier</p>
                    </div>
                    <div id='delivery' className="max-w-xs bg-white text-[#6A1B9A] rounded-lg p-6 shadow-lg">
                        <p className="text-lg italic mb-4">
                            "Excellent fleet management and reliable services every time! Highly recommend."
                        </p>
                        <p className="font-semibold">Priya K., Transport Coordinator</p>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div id='delivery' className="mt-12 bg-[#212121] text-white py-10 px-5 rounded-lg text-center">
                <h2 className="text-3xl font-semibold mb-6">Ready to Ship?</h2>
                <p className="text-lg mb-6">Contact us today to book your next bulk milk transportation service. Our fleet is ready to handle your needs.</p>
                <button id='delivery' className="bg-[#F57C00] text-[#6A1B9A] px-6 py-3 rounded-lg shadow-lg transition duration-300 hover:bg-[#6A1B9A] hover:text-white">
                    Get a Quote <FaQuoteLeft className="inline-block ml-2" />
                </button>
            </div>

            {/* Track Your Vehicle Section */}
            <div id='delivery' className="mt-12 bg-white text-[#6A1B9A] py-10 px-5 rounded-lg">
                <h2 className="text-3xl font-semibold text-center mb-6">Track Your Vehicle</h2>
                <p className="text-lg text-center mb-6">
                    Stay updated with the status of your transport. Enter your vehicle ID to track your shipment. Powered by Weelseye for live tracking.
                </p>
                <div className="flex justify-center">
                    <input id='delivery'
                        type="text"
                        placeholder="Enter Vehicle ID"
                        className="py-2 px-6 border-2 border-[#6A1B9A] rounded-lg mr-4"
                    />
                    <button id='delivery' className="bg-[#F57C00] text-white px-6 py-2 rounded-lg shadow-lg">
                        Track <FaMapMarkerAlt className="inline-block ml-2" />
                    </button>
                </div>
            </div>

            {/* More Information Section */}
            <div className="mt-12 bg-[#6A1B9A] text-white py-8 px-5 rounded-lg">
                <h2 className="text-3xl font-semibold text-center mb-6">Why Choose Us?</h2>
                <p className="text-lg text-center">
                    At Jagdamba Transport Services, we ensure timely and safe transportation of bulk milk products. Our fleet is equipped to handle large loads and is maintained to the highest standards. Whether you're a dairy provider or need reliable transport, our fleet is ready to serve your needs.
                </p>
            </div>
        </div>
    );
};

export default Fleet;