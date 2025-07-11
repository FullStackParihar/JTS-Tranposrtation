 
import React, { useEffect, useState } from 'react';
import '../pages/mainbg.css';
import { Link } from 'react-router-dom';
import { useToggle } from "../Context/ToggleContext";
import { useAuth } from "../context/AuthContext";
import Button from '../components/Botton'; // Adjusted import for consistency
import { FaTruck, FaClock, FaShieldAlt, FaMapMarkedAlt } from "react-icons/fa";
import TrucksData from '../utility/TruckData';

const HomePage = () => {
  const { toggle, toggleValue } = useToggle();
  const { isAuthenticated, user, token } = useAuth();
  const [isLoaded, setIsLoaded] = useState(true);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    companyName: "",
    serviceType: "bulk_transport",
    pickupLocation: "",
    deliveryLocation: "",
    cargoDetails: "",
    scheduledDate: new Date().toISOString().split('T')[0],
    vehicleType: "16ft_truck", // Default vehicle type
  });
  const [loading, setLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.success);
        setFormData({ ...formData, name: "", email: "", message: "" });
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleQuotationRequest = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in to request a quotation');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setQuoteResult(data.quote);
        alert(`Quote generated successfully! Estimated cost: ₹${data.quote.totalAmount}. Check your email (${user.email}) for details.`);
        setShowQuotationForm(false);
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: "",
          companyName: "",
          serviceType: "bulk_transport",
          pickupLocation: "",
          deliveryLocation: "",
          cargoDetails: "",
          scheduledDate: new Date().toISOString().split('T')[0],
          vehicleType: "16ft_truck",
        });
      } else {
        alert(data.error || "Failed to generate quote");
      }
    } catch (error) {
      alert("Failed to generate quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetService = () => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    } else {
      alert('Please sign in to access our services');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div id="mainbg" className="relative flex items-center justify-start bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A] h-[38rem] sm:h-[34rem] xs:h-[28rem]">
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center p-8 sm:p-6 xs:p-4">
          <div className="text-center">
            <h1 className="text-[2rem] sm:text-[3rem] xs:text-[1.5rem] font-extrabold font-barlow text-white">
              Reliable Bulk Milk Transportation
            </h1>
            <p className="mt-4 text-lg sm:text-lg xs:text-sm font-semibold text-white">
              Delivering fresh milk products safely across cities with our cold-chain logistics
            </p>
          </div>
        </div>
        <div id="getbutton" className="absolute w-full bottom-4 flex justify-center">
          <Button text="Get Service" onClick={handleGetService} />
        </div>
      </div>

      <div className="py-12 bg-white text-[#374151] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-[#1E293B] font-poppins text-4xl sm:text-3xl xs:text-2xl font-bold">Our Services</h2>
          <p className="text-lg sm:text-base xs:text-sm text-[#374151] mt-2">We provide a range of milk transportation solutions.</p>
        </div>
        <div className="mt-4 grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-10 sm:gap-6 xs:gap-4">
          {isLoaded
            ? TrucksData.map((truck) => (
                <Link
                  key={truck.id}
                  to={`/product/${truck.id}`}
                  className="p-8 bg-gray-300 border rounded-lg animate-pulse shadow-lg hover:shadow-2xl"
                >
                  <h3 className="text-4xl sm:text-xl xs:text-lg font-bold text-[#0070F3]"></h3>
                  <p className="text-[#374151] mt-2 text-sm xs:text-xs"></p>
                  <div className="h-80"></div>
                </Link>
              ))
            : TrucksData.map((truck) => (
                <Link
                  key={truck.id}
                  to={`/product/${truck.id}`}
                  id="service"
                  className="p-8 border rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
                >
                  <h3 className="text-4xl sm:text-xl xs:text-lg font-bold text-[#0070F3]">{truck.title}</h3>
                  <p className="text-[#374151] mt-2 text-sm xs:text-xs">{truck.description}</p>
                  <img className="p-12 sm:p-8 xs:p-4 object-cover w-full h-64" src={truck.image} alt={truck.title} />
                </Link>
              ))}
        </div>
      </div>

      <div id="delivery" className="mb-16 flex flex-col px-4 md:flex-row items-center justify-center gap-10">
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
            Your products, delivered on time, every time!
          </p>
        </div>
        <div id="delivery" className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 max-w-lg">
          <div className="bg-[#6A1B9A] text-white p-5 rounded-2xl flex items-center space-x-4 shadow-lg">
            <FaTruck size={50} className="text-[#F57C00]" />
            <div>
              <h3 className="text-xl font-bold">Extensive Fleet</h3>
              <p>We have a wide range of vehicles for your needs.</p>
            </div>
          </div>
          <div id="delivery" className="bg-[#6A1B9A] text-white p-5 rounded-2xl flex items-center space-x-4 shadow-lg">
            <FaClock size={50} className="text-[#F57C00]" />
            <div>
              <h3 className="text-xl font-bold">On-Time Delivery</h3>
              <p>We value your time with prompt delivery services.</p>
            </div>
          </div>
          <div id="delivery" className="bg-[#6A1B9A] text-white p-5 rounded-2xl flex items-center space-x-4 shadow-lg">
            <FaMapMarkedAlt size={50} className="text-[#F57C00]" />
            <div>
              <h3 className="text-xl font-bold">Efficient Routing</h3>
              <p>Optimized routes for timely deliveries.</p>
            </div>
          </div>
          <div id="delivery" className="bg-[#6A1B9A] text-white p-5 rounded-2xl flex items-center space-x-4 shadow-lg">
            <FaShieldAlt size={50} className="text-[#F57C00]" />
            <div>
              <h3 className="text-xl font-bold">Secure Transport</h3>
              <p>Your dairy products are transported with utmost care.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-[#6A1B9A] py-6 text-white text-center">
        <h2 id="delivery" className="text-3xl font-bold text-[#FFFFFF]">What Our Clients Say</h2>
        <div id="delivery" className="mt-6 grid md:grid-cols-2 gap-8 px-4 max-w-4xl mx-auto">
          <div className="p-6 bg-[#F57C00] text-white rounded-lg shadow-lg">
            <p className="text-lg">"Excellent service and on-time deliveries! Highly recommended."</p>
            <p className="mt-2 font-bold text-[#212121]">- D mart Ltd.</p>
          </div>
          <div id="delivery" className="p-6 bg-[#F57C00] text-white rounded-lg shadow-lg">
            <p className="text-lg">"Their cold-chain logistics are top-notch. Fresh milk every time!"</p>
            <p className="mt-2 font-bold text-[#212121]">- Keventer Icecream Pvt Ltd.</p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-[#6A1B9A] text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">Get in Touch</h2>
        <p className="mt-4 text-lg sm:text-xl">Have any questions or need a quote? Reach out to us!</p>
        <form onSubmit={handleSubmit} className="mt-8 max-w-md sm:max-w-lg mx-auto px-4 sm:px-0">
          <input
            id="delivery"
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="p-4 w-full mb-4 rounded-lg text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#F57C00] transition duration-300"
            required
          />
          <input
            id="delivery"
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="p-4 w-full mb-4 rounded-lg text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#F57C00] transition duration-300"
            required
          />
          <textarea
            id="delivery"
            name="message"
            placeholder="Your Message"
            value={formData.message || ""}
            onChange={handleChange}
            className="p-4 w-full mb-4 rounded-lg text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#F57C00] transition duration-300"
            rows="4"
            required
          />
          <button
            id="delivery"
            type="submit"
            disabled={loading}
            className="bg-[#F57C00] hover:bg-[#D65A00] text-white px-6 py-3 rounded-lg w-full sm:w-auto transition duration-300 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>

      <section className="bg-gradient-to-r from-[#FF512F] to-[#DD2476] py-12 sm:py-8 xs:py-6 text-center text-white px-4">
        <h2 className="text-3xl sm:text-2xl xs:text-xl font-bold">Ready to Transport with Us?</h2>
        <p className="mt-4 sm:mt-2 xs:mt-1 text-lg sm:text-base xs:text-sm">Get in touch and request a quote today.</p>
        <button
          onClick={() => setShowQuotationForm(true)}
          id="delivery"
          className="mt-6 inline-block bg-[#FFD700] text-[#002B5B] font-semibold px-8 sm:px-6 xs:px-4 py-3 sm:py-2 xs:py-1 rounded-lg hover:bg-[#FFECB3] transition duration-300"
          disabled={loading}
        >
          Request a Quote
        </button>

        {showQuotationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-[#6A1B9A] mb-4">Request a Quotation</h2>
              <form onSubmit={handleQuotationRequest}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-3 w-full text-black mb-4 border rounded-lg focus:ring-2 focus:ring-[#F57C00] bg-gray-100"
                  required
            
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-3 w-full text-black mb-4 border rounded-lg focus:ring-2 focus:ring-[#F57C00] bg-gray-100"
                  required
                  
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="p-3 w-full text-black mb-4 border rounded-lg focus:ring-2 focus:ring-[#F57C00]"
                  required
                />
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name (Optional)"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="p-3 w-full text-black mb-4 border rounded-lg focus:ring-2 focus:ring-[#F57C00]"
                />
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="p-3 w-full text-black mb-4 border rounded-lg focus:ring-2 focus:ring-[#F57C00]"
                  required
                >
                  <option value="bulk_transport">Bulk Transport</option>
                  <option value="cold_chain">Cold Chain</option>
                  <option value="express_delivery">Express Delivery</option>
                  <option value="scheduled_pickup">Scheduled Pickup</option>
                </select>
                <input
                  type="text"
                  name="pickupLocation"
                  placeholder="Pickup Location"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  className="p-3 w-full text-black mb-4 border rounded-lg focus:ring-2 focus:ring-[#F57C00]"
                  required
                />
                <input
                  type="text"
                  name="deliveryLocation"
                  placeholder="Delivery Location"
                  value={formData.deliveryLocation}
                  onChange={handleChange}
                  className="p-3 w-full text-black mb-4 border rounded-lg focus:ring-2 focus:ring-[#F57C00]"
                  required
                />
                <input
                  type="text"
                  name="cargoDetails"
                  placeholder="Cargo Details (e.g., 1000 liters of milk)"
                  value={formData.cargoDetails}
                  onChange={handleChange}
                  className="p-3 w-full text-black mb-4 border rounded-lg focus:ring-2 focus:ring-[#F57C00]"
                  required
                />
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  className="p-3 w-full text-black mb-4 border rounded-lg focus:ring-2 focus:ring-[#F57C00]"
                  required
                />
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="p-3 w-full text-black mb-4 border rounded-lg focus:ring-2 focus:ring-[#F57C00]"
                  required
                >
                  <option value="16ft_truck">16ft Truck</option>
                  <option value="19ft_truck">19ft Truck</option>
                  <option value="pickup_truck">Pickup Truck</option>
                  <option value="refrigerated_truck">Refrigerated Truck</option>
                </select>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowQuotationForm(false)}
                    className="px-4 text-black py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#F57C00] text-white rounded-lg hover:bg-[#D65A00] disabled:opacity-50"
                  >
                    {loading ? "Generating..." : "Get Quote"}
                  </button>
                </div>
              </form>
              {quoteResult && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
                  <h3 className="text-lg font-bold">Quote Summary</h3>
                  <p>Estimated Cost: ₹{quoteResult.totalAmount}</p>
                  <p>Quote ID: {quoteResult.quoteId}</p>
                  <p>Created: {new Date(quoteResult.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                </div>
              )}
            </div>
          </div>
        )}
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
            <p className="text-sm xs:text-xs">Contact: +91 8118867247</p>
            <p className="text-sm xs:text-xs">Email: contact@jagdambatransport.com</p>
          </div>
          <div className="mt-4 sm:mt-0 xs:mt-2 flex space-x-4 justify-center sm:justify-start">
            <a href="#" className="hover:text-[#FFA500] text-sm xs:text-xs">Facebook</a>
            <a href="#" className="hover:text-[#FFA500] text-sm xs:text-xs">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;