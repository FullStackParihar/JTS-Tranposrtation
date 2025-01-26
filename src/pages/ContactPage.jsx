import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaUsers, FaBuilding } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-12">
      <div className="container mt-8 mx-auto px-4">
        <div className="animate-fade-in">
          <h1 className="text-center text-5xl font-bold text-purple-800 mb-12 tracking-wide">
            Contact Jagdamba Transport
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
          <div className="bg-white p-16 rounded-2xl shadow-2xl transform transition-all hover:scale-105">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaPhoneAlt className="mr-3 text-orange-500" /> Get in Touch
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Have questions or need assistance? We're here to help you every step of the way.
            </p>
            <div className="space-y-6">
              <div className="flex items-center group"><FaPhoneAlt className="mr-3 text-purple-700" /><span className="text-gray-800 font-medium">+91 123 456 7890</span></div>
              <div className="flex items-center group"><FaEnvelope className="mr-3 text-purple-700" /><span className="text-gray-800 font-medium">contact@jagdambatransport.com</span></div>
              <div className="flex items-center group"><FaMapMarkerAlt className="mr-3 text-purple-700" /><span className="text-gray-800 font-medium">Patel Nagar, New Delhi, India (110008)</span></div>
            </div>
          </div>

          <div className="bg-white p-16 rounded-2xl shadow-2xl transform transition-all hover:scale-105">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaPaperPlane className="mr-3 text-orange-500" /> Send Us a Message
            </h2>
            {isSubmitted && (
              <div className="mb-6 text-green-600 bg-green-50 p-4 rounded-lg flex items-center">
                <FaPaperPlane className="mr-3" /> Thank you for contacting us! We'll get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" name="name" className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
              <textarea name="message" rows="5" className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500" placeholder="Your Message" value={formData.message} onChange={handleChange} required></textarea>
              <button type="submit" className="bg-purple-700 text-white py-3 px-6 rounded-lg hover:bg-purple-600 focus:ring-2 flex focus:ring-purple-500 transform transition-all hover:scale-105">
                <FaPaperPlane className="mr-3 mt-1" /> Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6"><FaUsers className="inline-block text-orange-500 mr-2" /> Customer Support</h2>
          <p className="text-gray-600 max-w-4xl mx-auto">Our dedicated support team is available 24/7 to assist you with any queries. Feel free to reach out via call or email.</p>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6"><FaBuilding className="inline-block text-orange-500 mr-2" /> Our Branches</h2>
          <p className="text-gray-600 max-w-4xl mx-auto">We have multiple branches across India to provide you with efficient logistics solutions.</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;