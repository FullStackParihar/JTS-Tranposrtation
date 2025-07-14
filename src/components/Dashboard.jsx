 


// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { 
//   FaTruck, 
//   FaClipboardList, 
//   FaMapMarkerAlt, 
//   FaUser, 
//   FaPlus,
//   FaEye,
//   FaEdit,
//   FaSearch,
//   FaFilter,
//   FaThermometerHalf,
//   FaCalendarAlt,
//   FaDollarSign,
//   FaUserCheck
// } from 'react-icons/fa';
// import baseurl from '../utility/baseurl';
// import { debounce } from 'lodash';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Dashboard = () => {
//   const { user, token } = useAuth();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [showEditBookingForm, setShowEditBookingForm] = useState(false);
//   const [showQuoteForm, setShowQuoteForm] = useState(false);
//   const [showAssignDriverForm, setShowAssignDriverForm] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [bookings, setBookings] = useState([]);
//   const [drivers, setDrivers] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [assignFormData, setAssignFormData] = useState({ driverId: '', vehicleId: '' });
//   const [stats, setStats] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [quote, setQuote] = useState(null);
//   const [geoLoading, setGeoLoading] = useState({ pickup: false, delivery: false });
//   const [suggestions, setSuggestions] = useState({ pickup: [], delivery: [] });
//   const [error, setError] = useState({ pickup: '', delivery: '' });
//   const [formLoading, setFormLoading] = useState(false);

//   // Booking Form State
//   const [formData, setFormData] = useState({
//     serviceType: 'bulk_transport',
//     vehicleType: '16ft_truck',
//     pickupLocation: {
//       address: '',
//       contactPerson: '',
//       contactPhone: '',
//       coordinates: { latitude: '', longitude: '' }
//     },
//     deliveryLocation: {
//       address: '',
//       contactPerson: '',
//       contactPhone: '',
//       coordinates: { latitude: '', longitude: '' }
//     },
//     scheduledPickup: '',
//     cargo: {
//       type: 'milk',
//       quantity: '',
//       unit: 'liters',
//       temperature: {
//         required: false,
//         min: '',
//         max: ''
//       },
//       specialInstructions: ''
//     }
//   });

//   // Quote Form State
//   const [quoteFormData, setQuoteFormData] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     phone: '',
//     companyName: '',
//     serviceType: 'bulk_transport',
//     vehicleType: '16ft_truck',
//     pickupLocation: '',
//     deliveryLocation: '',
//     cargoDetails: '1000 liters of milk',
//     scheduledDate: new Date().toISOString().split('T')[0],
//   });

//   useEffect(() => {
//     fetchDashboardData();
//     if (['admin', 'manager'].includes(user?.role)) {
//       fetchDriversAndVehicles();
//     }
//   }, [user?.role]);

//   const fetchDashboardData = async () => {
//     try {
//       const [bookingsRes, statsRes] = await Promise.all([
//         fetch(`${baseurl}/api/bookings`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         fetch(`${baseurl}/api/dashboard/stats`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         })
//       ]);

//       if (bookingsRes.ok) {
//         const bookingsData = await bookingsRes.json();
//         setBookings(bookingsData.bookings);
//       } else {
//         throw new Error('Failed to fetch bookings');
//       }

//       if (statsRes.ok) {
//         const statsData = await statsRes.json();
//         setStats(statsData.stats);
//       } else {
//         throw new Error('Failed to fetch stats');
//       }
//     } catch (error) {
//       toast.error('Error fetching dashboard data: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDriversAndVehicles = async () => {
//     try {
//       const [driversRes, vehiclesRes] = await Promise.all([
//         fetch(`${baseurl}/api/drivers`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         fetch(`${baseurl}/api/vehicles`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         })
//       ]);

//       if (driversRes.ok) {
//         const driversData = await driversRes.json();
//         setDrivers(driversData.drivers);
//       } else {
//         throw new Error('Failed to fetch drivers');
//       }

//       if (vehiclesRes.ok) {
//         const vehiclesData = await vehiclesRes.json();
//         setVehicles(vehiclesData);
//       } else {
//         throw new Error('Failed to fetch vehicles');
//       }
//       console.log('vehicles', vehicles);
//     } catch (error) {
//       toast.error('Error fetching drivers/vehicles: ' + error.message);
//     }
//   };

//   const fetchCoordinates = debounce(async (address, locationType, isEditForm = false) => {
//     const key = locationType === 'pickupLocation' ? 'pickup' : 'delivery';
//     setGeoLoading(prev => ({ ...prev, [key]: true }));
//     setError(prev => ({ ...prev, [key]: '' }));
//     try {
//       const response = await fetch(
//         `https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${encodeURIComponent(address)}&format=json`
//       );
//       if (!response.ok) {
//         if (response.status === 401) throw new Error('Invalid API key');
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       if (data && data.length > 0) {
//         const { lat, lon } = data[0];
//         if (isEditForm) {
//           setSelectedBooking(prev => ({
//             ...prev,
//             [locationType]: {
//               ...prev[locationType],
//               coordinates: { latitude: parseFloat(lat), longitude: parseFloat(lon) }
//             }
//           }));
//         } else {
//           setFormData(prev => ({
//             ...prev,
//             [locationType]: {
//               ...prev[locationType],
//               coordinates: { latitude: parseFloat(lat), longitude: parseFloat(lon) }
//             }
//           }));
//         }
//       } else {
//         setError(prev => ({ ...prev, [key]: 'No coordinates found for this address' }));
//       }
//     } catch (error) {
//       setError(prev => ({ ...prev, [key]: error.message }));
//     } finally {
//       setGeoLoading(prev => ({ ...prev, [key]: false }));
//     }
//   }, 300);

//   const fetchSuggestions = async (query, locationType) => {
//     const key = locationType === 'pickupLocation' ? 'pickup' : 'delivery';
//     try {
//       const response = await fetch(
//         `https://us1.locationiq.com/v1/autocomplete.php?key=pk.4ebcc4fec220d7040d681509bbb07232&q=${encodeURIComponent(query)}&format=json&limit=5`
//       );
//       if (!response.ok) {
//         if (response.status === 401) throw new Error('Invalid API key');
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       setSuggestions(prev => ({
//         ...prev,
//         [key]: data
//       }));
//     } catch (error) {
//       setSuggestions(prev => ({ ...prev, [key]: [] }));
//       setError(prev => ({ ...prev, [key]: error.message }));
//     }
//   };

//   const handleChange = (e, isQuoteForm = false) => {
//     const { name, value } = e.target;
//     const data = isQuoteForm ? quoteFormData : formData;
//     const setData = isQuoteForm ? setQuoteFormData : setFormData;

//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       if (parent === 'cargo' && child === 'temperature') {
//         setData(prev => ({
//           ...prev,
//           cargo: {
//             ...prev.cargo,
//             temperature: {
//               ...prev.cargo.temperature,
//               required: e.target.checked
//             }
//           }
//         }));
//       } else if (parent === 'pickupLocation' || parent === 'deliveryLocation') {
//         setData(prev => ({
//           ...prev,
//           [parent]: {
//             ...prev[parent],
//             [child]: value
//           }
//         }));
//         if (child === 'address' && value.length > 2) {
//           fetchSuggestions(value, parent);
//           fetchCoordinates(value, parent);
//         } else {
//           setSuggestions(prev => ({ ...prev, [parent === 'pickupLocation' ? 'pickup' : 'delivery']: [] }));
//         }
//       } else {
//         setData(prev => ({
//           ...prev,
//           [parent]: {
//             ...prev[parent],
//             [child]: value
//           }
//         }));
//       }
//     } else {
//       setData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       if (parent === 'cargo' && child === 'temperature') {
//         setSelectedBooking(prev => ({
//           ...prev,
//           cargo: {
//             ...prev.cargo,
//             temperature: {
//               ...prev.cargo.temperature,
//               required: e.target.checked
//             }
//           }
//         }));
//       } else if (parent === 'pickupLocation' || parent === 'deliveryLocation') {
//         setSelectedBooking(prev => ({
//           ...prev,
//           [parent]: {
//             ...prev[parent],
//             [child]: value
//           }
//         }));
//         if (child === 'address' && value.length > 2) {
//           fetchSuggestions(value, parent);
//           fetchCoordinates(value, parent, true);
//         } else {
//           setSuggestions(prev => ({ ...prev, [parent === 'pickupLocation' ? 'pickup' : 'delivery']: [] }));
//         }
//       } else {
//         setSelectedBooking(prev => ({
//           ...prev,
//           [parent]: {
//             ...prev[parent],
//             [child]: value
//           }
//         }));
//       }
//     } else {
//       setSelectedBooking(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleAssignChange = (e) => {
//     const { name, value } = e.target;
//     setAssignFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSuggestionSelect = (suggestion, locationType, isEditForm = false) => {
//     const [parent] = locationType.split('.');
//     const setData = isEditForm ? setSelectedBooking : setFormData;
//     setData(prev => ({
//       ...prev,
//       [parent]: {
//         ...prev[parent],
//         address: suggestion.display_name,
//         coordinates: { latitude: parseFloat(suggestion.lat), longitude: parseFloat(suggestion.lon) }
//       }
//     }));
//     setSuggestions(prev => ({ ...prev, [parent === 'pickupLocation' ? 'pickup' : 'delivery']: [] }));
//     setError(prev => ({ ...prev, [parent === 'pickupLocation' ? 'pickup' : 'delivery']: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormLoading(true);

//     try {
//       const response = await fetch(`${baseurl}/api/bookings`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setBookings(prev => [data.booking, ...prev]);
//         setShowBookingForm(false);
//         setFormData({
//           serviceType: 'bulk_transport',
//           vehicleType: '16ft_truck',
//           pickupLocation: {
//             address: '',
//             contactPerson: '',
//             contactPhone: '',
//             coordinates: { latitude: '', longitude: '' }
//           },
//           deliveryLocation: {
//             address: '',
//             contactPerson: '',
//             contactPhone: '',
//             coordinates: { latitude: '', longitude: '' }
//           },
//           scheduledPickup: '',
//           cargo: {
//             type: 'milk',
//             quantity: '',
//             unit: 'liters',
//             temperature: {
//               required: false,
//               min: '',
//               max: ''
//             },
//             specialInstructions: ''
//           }
//         });
//         toast.success('Booking created successfully!');
//       } else {
//         toast.error(data.error || 'Failed to create booking');
//       }
//     } catch (error) {
//       toast.error('Network error. Please try again.');
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     setFormLoading(true);

//     try {
//       const response = await fetch(`${baseurl}/api/bookings/${selectedBooking._id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(selectedBooking)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setBookings(prev => prev.map(b => b._id === selectedBooking._id ? data.booking : b));
//         setShowEditBookingForm(false);
//         setSelectedBooking(null);
//         toast.success('Booking updated successfully!');
//       } else {
//         toast.error(data.error || 'Failed to update booking');
//       }
//     } catch (error) {
//       toast.error('Network error. Please try again.');
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleAssignSubmit = async (e) => {
//     e.preventDefault();
//     setFormLoading(true);

//     try {
//       const response = await fetch(`${baseurl}/api/bookings/${selectedBooking._id}/assign`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(assignFormData)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setBookings(prev => prev.map(b => b._id === selectedBooking._id ? data.booking : b));
//         setShowAssignDriverForm(false);
//         setSelectedBooking(null);
//         setAssignFormData({ driverId: '', vehicleId: '' });
//         toast.success('Driver and vehicle assigned successfully!');
//       } else {
//         toast.error(data.error || 'Failed to assign driver');
//       }
//     } catch (error) {
//       toast.error('Network error. Please try again.');
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const calculateQuote = async () => {
//     try {
//       const response = await fetch(
//         `${baseurl}/api/calculate-quote?serviceType=${quoteFormData.serviceType}&vehicleType=${quoteFormData.vehicleType}&pickupLocation=${encodeURIComponent(quoteFormData.pickupLocation)}&deliveryLocation=${encodeURIComponent(quoteFormData.deliveryLocation)}&cargoQuantity=${quoteFormData.cargoDetails}`,
//         {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }
//       );
//       if (!response.ok) throw new Error('Failed to calculate quote');
//       const data = await response.json();
//       setQuote(data.quote);
//     } catch (error) {
//       toast.error('Failed to calculate quote. Please try again.');
//     }
//   };

//   const requestQuote = async () => {
//     try {
//       const response = await fetch(`${baseurl}/api/quote`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(quoteFormData)
//       });
//       if (!response.ok) throw new Error('Failed to request quote');
//       const data = await response.json();
//       toast.success(data.message);
//       setShowQuoteForm(false);
//       setQuote(null);
//     } catch (error) {
//       toast.error('Failed to request quote. Please try again.');
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       confirmed: 'bg-blue-100 text-blue-800',
//       assigned: 'bg-purple-100 text-purple-800',
//       in_transit: 'bg-orange-100 text-orange-800',
//       delivered: 'bg-green-100 text-green-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const filteredBookings = bookings.filter(booking => {
//     const matchesSearch = booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          booking.pickupLocation.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          booking.deliveryLocation.address.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6A1B9A]"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 pt-20">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Welcome back, {user?.name}!
//           </h1>
//           <p className="text-gray-600">Manage your transportation bookings and track deliveries</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="p-3 rounded-full bg-blue-100">
//                 <FaClipboardList className="text-blue-600 text-xl" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Bookings</p>
//                 <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings || 0}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="p-3 rounded-full bg-orange-100">
//                 <FaTruck className="text-orange-600 text-xl" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Active Deliveries</p>
//                 <p className="text-2xl font-semibold text-gray-900">{stats.activeBookings || 0}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="p-3 rounded-full bg-green-100">
//                 <FaMapMarkerAlt className="text-green-600 text-xl" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Available Vehicles</p>
//                 <p className="text-2xl font-semibold text-gray-900">{stats.availableVehicles || 0}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="p-3 rounded-full bg-purple-100">
//                 <FaUser className="text-purple-600 text-xl" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//                 <p className="text-2xl font-semibold text-gray-900">₹{stats.totalRevenue?.toLocaleString() || 0}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="bg-white rounded-lg shadow mb-6">
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-8 px-6">
//               {[
//                 { id: 'overview', label: 'Overview', icon: FaClipboardList },
//                 { id: 'bookings', label: 'My Bookings', icon: FaTruck },
//                 { id: 'profile', label: 'Profile', icon: FaUser }
//               ].map(tab => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
//                     activeTab === tab.id
//                       ? 'border-[#6A1B9A] text-[#6A1B9A]'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   <tab.icon className="mr-2" />
//                   {tab.label}
//                 </button>
//               ))}
//             </nav>
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="bg-white rounded-lg shadow">
//           {activeTab === 'overview' && (
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
//                 <div className="space-x-4">
//                   <button
//                     onClick={() => setShowBookingForm(true)}
//                     className="bg-[#6A1B9A] text-white px-4 py-2 rounded-lg hover:bg-[#5A1A8A] flex items-center"
//                   >
//                     <FaPlus className="mr-2" />
//                     New Booking
//                   </button>
              
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
//                   <h3 className="font-semibold text-gray-900 mb-2">Recent Activity</h3>
//                   <p className="text-gray-600 text-sm">View your latest bookings and deliveries</p>
//                   <button 
//                     onClick={() => setActiveTab('bookings')}
//                     className="mt-3 text-[#6A1B9A] hover:text-[#5A1A8A] font-medium"
//                   >
//                     View All →
//                   </button>
//                 </div>

//                 <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
//                   <h3 className="font-semibold text-gray-900 mb-2">Track Delivery</h3>
//                   <p className="text-gray-600 text-sm">Real-time tracking of your shipments</p>
//                   <button className="mt-3 text-[#6A1B9A] hover:text-[#5A1A8A] font-medium">
//                     Track Now →
//                   </button>
//                 </div>

//                 <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
//                   <h3 className="font-semibold text-gray-900 mb-2">Get Quote</h3>
//                   <p className="text-gray-600 text-sm">Calculate pricing for your next shipment</p>
//                   <button
//                     onClick={() => setShowQuoteForm(true)}
//                     className="mt-3 text-[#6A1B9A] hover:text-[#5A1A8A] font-medium"
//                   >
//                     Calculate →
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'bookings' && (
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
//                 <button
//                   onClick={() => setShowBookingForm(true)}
//                   className="bg-[#6A1B9A] text-white px-4 py-2 rounded-lg hover:bg-[#5A1A8A] flex items-center"
//                 >
//                   <FaPlus className="mr-2" />
//                   New Booking
//                 </button>
//               </div>

//               {/* Search and Filter */}
//               <div className="flex flex-col sm:flex-row gap-4 mb-6">
//                 <div className="relative flex-1">
//                   <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search bookings..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                   />
//                 </div>
//                 <div className="relative">
//                   <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="pending">Pending</option>
//                     <option value="confirmed">Confirmed</option>
//                     <option value="assigned">Assigned</option>
//                     <option value="in_transit">In Transit</option>
//                     <option value="delivered">Delivered</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Bookings List */}
//               <div className="space-y-4">
//                 {filteredBookings.length === 0 ? (
//                   <div className="text-center py-8">
//                     <FaClipboardList className="mx-auto text-gray-400 text-4xl mb-4" />
//                     <p className="text-gray-600">No bookings found</p>
//                     <button
//                       onClick={() => setShowBookingForm(true)}
//                       className="mt-4 bg-[#6A1B9A] text-white px-4 py-2 rounded-lg hover:bg-[#5A1A8A]"
//                     >
//                       Create Your First Booking
//                     </button>
//                   </div>
//                 ) : (
//                   filteredBookings.map(booking => (
//                     <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
//                       <div className="flex justify-between items-start mb-3">
//                         <div>
//                           <h3 className="font-semibold text-gray-900">#{booking.bookingId}</h3>
//                           <p className="text-sm text-gray-600">{booking.serviceType.replace('_', ' ').toUpperCase()}</p>
//                         </div>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
//                           {booking.status.replace('_', ' ').toUpperCase()}
//                         </span>
//                       </div>

//                       <div className="grid md:grid-cols-2 gap-4 mb-3">
//                         <div>
//                           <p className="text-sm text-gray-600">From:</p>
//                           <p className="font-medium">{booking.pickupLocation.address}</p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-600">To:</p>
//                           <p className="font-medium">{booking.deliveryLocation.address}</p>
//                         </div>
//                       </div>

//                       <div className="flex justify-between items-center">
//                         <div>
//                           <p className="text-sm text-gray-600">
//                             Scheduled: {new Date(booking.scheduledPickup).toLocaleDateString()}
//                           </p>
//                           <p className="font-semibold text-[#6A1B9A]">
//                             ₹{booking.pricing.totalAmount.toLocaleString()}
//                           </p>
//                         </div>
//                         <div className="flex space-x-2">
//                           <button className="p-2 text-gray-600 hover:text-[#6A1B9A]">
//                             <FaEye />
//                           </button>
//                           {booking.status === 'pending' && (
//                             <button 
//                               onClick={() => {
//                                 setSelectedBooking({
//                                   ...booking,
//                                   scheduledPickup: new Date(booking.scheduledPickup).toISOString().slice(0, 16)
//                                 });
//                                 setShowEditBookingForm(true);
//                               }}
//                               className="p-2 text-gray-600 hover:text-[#6A1B9A]"
//                             >
//                               <FaEdit />
//                             </button>
//                           )}
//                              <button 
//                               onClick={() => {
//                                 setSelectedBooking(booking);
//                                 setShowAssignDriverForm(true);
//                               }}
//                               className="p-2 text-gray-600 hover:text-[#6A1B9A]"
//                             >
//                               <FaUserCheck />
//                             </button>
                          
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           )}

//           {activeTab === 'profile' && (
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
//               <div className="max-w-md">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                     <input
//                       type="text"
//                       value={user?.name || ''}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       readOnly
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                     <input
//                       type="email"
//                       value={user?.email || ''}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       readOnly
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//                     <input
//                       type="text"
//                       value={user?.role || ''}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       readOnly
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Booking Form Modal */}
//         {showBookingForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-2xl font-bold text-[#6A1B9A]">Create New Booking</h2>
//                   <button
//                     onClick={() => setShowBookingForm(false)}
//                     className="text-gray-500 hover:text-gray-700 text-2xl"
//                   >
//                     ×
//                   </button>
//                 </div>
//               </div>

//               <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                 {/* Service & Vehicle Type */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <FaTruck className="inline mr-2" />
//                       Service Type
//                     </label>
//                     <select
//                       name="serviceType"
//                       value={formData.serviceType}
//                       onChange={(e) => handleChange(e)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     >
//                       <option value="bulk_transport">Bulk Transport</option>
//                       <option value="cold_chain">Cold Chain</option>
//                       <option value="express_delivery">Express Delivery</option>
//                       <option value="scheduled_pickup">Scheduled Pickup</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Vehicle Type
//                     </label>
//                     <select
//                       name="vehicleType"
//                       value={formData.vehicleType}
//                       onChange={(e) => handleChange(e)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     >
//                       <option value="16ft_truck">16ft Truck</option>
//                       <option value="19ft_truck">19ft Truck</option>
//                       <option value="pickup_truck">Pickup Truck</option>
//                       <option value="refrigerated_truck">Refrigerated Truck</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Pickup Location */}
//                 <div className="border rounded-lg p-4">
//                   <h3 className="text-lg font-semibold text-[#6A1B9A] mb-3">
//                     <FaMapMarkerAlt className="inline mr-2" />
//                     Pickup Location
//                   </h3>
//                   <div className="grid md:grid-cols-3 gap-4">
//                     <div className="md:col-span-2 relative">
//                       <input
//                         type="text"
//                         name="pickupLocation.address"
//                         placeholder="Pickup Address"
//                         value={formData.pickupLocation.address}
//                         onChange={(e) => handleChange(e)}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                         required
//                       />
//                       {suggestions.pickup.length > 0 && (
//                         <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg">
//                           {suggestions.pickup.map((suggestion, index) => (
//                             <li
//                               key={index}
//                               className="p-2 hover:bg-gray-100 cursor-pointer"
//                               onClick={() => handleSuggestionSelect(suggestion, 'pickupLocation')}
//                             >
//                               {suggestion.display_name}
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                       {error.pickup && <p className="text-red-500 mt-1">{error.pickup}</p>}
//                     </div>
//                     <div>
//                       <input
//                         type="text"
//                         name="pickupLocation.contactPerson"
//                         placeholder="Contact Person"
//                         value={formData.pickupLocation.contactPerson}
//                         onChange={(e) => handleChange(e)}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       />
//                     </div>
//                     <div className="md:col-span-3">
//                       <input
//                         type="tel"
//                         name="pickupLocation.contactPhone"
//                         placeholder="Contact Phone"
//                         value={formData.pickupLocation.contactPhone}
//                         onChange={(e) => handleChange(e)}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       />
//                     </div>
//                     {geoLoading.pickup && <p className="text-blue-500">Fetching coordinates...</p>}
//                     {!geoLoading.pickup && formData.pickupLocation.coordinates.latitude && (
//                       <div className="md:col-span-3">
//                         <p>Latitude: {formData.pickupLocation.coordinates.latitude}</p>
//                         <p>Longitude: {formData.pickupLocation.coordinates.longitude}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Delivery Location */}
//                 <div className="border rounded-lg p-4">
//                   <h3 className="text-lg font-semibold text-[#6A1B9A] mb-3">
//                     <FaMapMarkerAlt className="inline mr-2" />
//                     Delivery Location
//                   </h3>
//                   <div className="grid md:grid-cols-3 gap-4">
//                     <div className="md:col-span-2 relative">
//                       <input
//                         type="text"
//                         name="deliveryLocation.address"
//                         placeholder="Delivery Address"
//                         value={formData.deliveryLocation.address}
//                         onChange={(e) => handleChange(e)}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                         required
//                       />
//                       {suggestions.delivery.length > 0 && (
//                         <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg">
//                           {suggestions.delivery.map((suggestion, index) => (
//                             <li
//                               key={index}
//                               className="p-2 hover:bg-gray-100 cursor-pointer"
//                               onClick={() => handleSuggestionSelect(suggestion, 'deliveryLocation')}
//                             >
//                               {suggestion.display_name}
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                       {error.delivery && <p className="text-red-500 mt-1">{error.delivery}</p>}
//                     </div>
//                     <div>
//                       <input
//                         type="text"
//                         name="deliveryLocation.contactPerson"
//                         placeholder="Contact Person"
//                         value={formData.deliveryLocation.contactPerson}
//                         onChange={(e) => handleChange(e)}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       />
//                     </div>
//                     <div className="md:col-span-3">
//                       <input
//                         type="tel"
//                         name="deliveryLocation.contactPhone"
//                         placeholder="Contact Phone"
//                         value={formData.deliveryLocation.contactPhone}
//                         onChange={(e) => handleChange(e)}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       />
//                     </div>
//                     {geoLoading.delivery && <p className="text-blue-500">Fetching coordinates...</p>}
//                     {!geoLoading.delivery && formData.deliveryLocation.coordinates.latitude && (
//                       <div className="md:col-span-3">
//                         <p>Latitude: {formData.deliveryLocation.coordinates.latitude}</p>
//                         <p>Longitude: {formData.deliveryLocation.coordinates.longitude}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Schedule & Cargo */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <FaCalendarAlt className="inline mr-2" />
//                       Scheduled Pickup
//                     </label>
//                     <input
//                       type="datetime-local"
//                       name="scheduledPickup"
//                       value={formData.scheduledPickup}
//                       onChange={(e) => handleChange(e)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Cargo Type
//                     </label>
//                     <select
//                       name="cargo.type"
//                       value={formData.cargo.type}
//                       onChange={(e) => handleChange(e)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                     >
//                       <option value="milk">Milk</option>
//                       <option value="dairy_products">Dairy Products</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Quantity */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Quantity
//                     </label>
//                     <input
//                       type="number"
//                       name="cargo.quantity"
//                       placeholder="Enter quantity"
//                       value={formData.cargo.quantity}
//                       onChange={(e) => handleChange(e)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Unit
//                     </label>
//                     <select
//                       name="cargo.unit"
//                       value={formData.cargo.unit}
//                       onChange={(e) => handleChange(e)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                     >
//                       <option value="liters">Liters</option>
//                       <option value="kg">Kilograms</option>
//                       <option value="tons">Tons</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Temperature Control */}
//                 <div className="border rounded-lg p-4">
//                   <div className="flex items-center mb-3">
//                     <input
//                       type="checkbox"
//                       name="cargo.temperature"
//                       checked={formData.cargo.temperature.required}
//                       onChange={(e) => handleChange(e)}
//                       className="mr-2"
//                     />
//                     <label className="text-lg font-semibold text-[#6A1B9A]">
//                       <FaThermometerHalf className="inline mr-2" />
//                       Temperature Control Required
//                     </label>
//                   </div>

//                   {formData.cargo.temperature.required && (
//                     <div className="grid md:grid-cols-2 gap-4">
//                       <div>
//                         <input
//                           type="number"
//                           name="cargo.temperature.min"
//                           placeholder="Min Temperature (°C)"
//                           value={formData.cargo.temperature.min}
//                           onChange={(e) => setFormData(prev => ({
//                             ...prev,
//                             cargo: {
//                               ...prev.cargo,
//                               temperature: { ...prev.cargo.temperature, min: e.target.value }
//                             }
//                           }))}
//                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                         />
//                       </div>
//                       <div>
//                         <input
//                           type="number"
//                           name="cargo.temperature.max"
//                           placeholder="Max Temperature (°C)"
//                           value={formData.cargo.temperature.max}
//                           onChange={(e) => setFormData(prev => ({
//                             ...prev,
//                             cargo: {
//                               ...prev.cargo,
//                               temperature: { ...prev.cargo.temperature, max: e.target.value }
//                             }
//                           }))}
//                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Special Instructions */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Special Instructions
//                   </label>
//                   <textarea
//                     name="cargo.specialInstructions"
//                     placeholder="Any special handling requirements..."
//                     value={formData.cargo.specialInstructions}
//                     onChange={(e) => handleChange(e)}
//                     rows="3"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <div className="flex justify-end space-x-4 pt-4 border-t">
//                   <button
//                     type="button"
//                     onClick={() => setShowBookingForm(false)}
//                     className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={formLoading}
//                     className="px-6 py-3 bg-[#6A1B9A] text-white rounded-lg hover:bg-[#5A1A8A] disabled:opacity-50"
//                   >
//                     {formLoading ? 'Creating...' : 'Create Booking'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Edit Booking Form Modal */}
//         {showEditBookingForm && selectedBooking && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-2xl font-bold text-[#6A1B9A]">Edit Booking #{selectedBooking.bookingId}</h2>
//                   <button
//                     onClick={() => {
//                       setShowEditBookingForm(false);
//                       setSelectedBooking(null);
//                     }}
//                     className="text-gray-500 hover:text-gray-700 text-2xl"
//                   >
//                     ×
//                   </button>
//                 </div>
//               </div>

//               <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
//                 {/* Service & Vehicle Type */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <FaTruck className="inline mr-2" />
//                       Service Type
//                     </label>
//                     <select
//                       name="serviceType"
//                       value={selectedBooking.serviceType}
//                       onChange={handleEditChange}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     >
//                       <option value="bulk_transport">Bulk Transport</option>
//                       <option value="cold_chain">Cold Chain</option>
//                       <option value="express_delivery">Express Delivery</option>
//                       <option value="scheduled_pickup">Scheduled Pickup</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Vehicle Type
//                     </label>
//                     <select
//                       name="vehicleType"
//                       value={selectedBooking.vehicleType}
//                       onChange={handleEditChange}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     >
//                       <option value="16ft_truck">16ft Truck</option>
//                       <option value="19ft_truck">19ft Truck</option>
//                       <option value="pickup_truck">Pickup Truck</option>
//                       <option value="refrigerated_truck">Refrigerated Truck</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Pickup Location */}
//                 <div className="border rounded-lg p-4">
//                   <h3 className="text-lg font-semibold text-[#6A1B9A] mb-3">
//                     <FaMapMarkerAlt className="inline mr-2" />
//                     Pickup Location
//                   </h3>
//                   <div className="grid md:grid-cols-3 gap-4">
//                     <div className="md:col-span-2 relative">
//                       <input
//                         type="text"
//                         name="pickupLocation.address"
//                         placeholder="Pickup Address"
//                         value={selectedBooking.pickupLocation.address}
//                         onChange={handleEditChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                         required
//                       />
//                       {suggestions.pickup.length > 0 && (
//                         <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg">
//                           {suggestions.pickup.map((suggestion, index) => (
//                             <li
//                               key={index}
//                               className="p-2 hover:bg-gray-100 cursor-pointer"
//                               onClick={() => handleSuggestionSelect(suggestion, 'pickupLocation', true)}
//                             >
//                               {suggestion.display_name}
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                       {error.pickup && <p className="text-red-500 mt-1">{error.pickup}</p>}
//                     </div>
//                     <div>
//                       <input
//                         type="text"
//                         name="pickupLocation.contactPerson"
//                         placeholder="Contact Person"
//                         value={selectedBooking.pickupLocation.contactPerson}
//                         onChange={handleEditChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       />
//                     </div>
//                     <div className="md:col-span-3">
//                       <input
//                         type="tel"
//                         name="pickupLocation.contactPhone"
//                         placeholder="Contact Phone"
//                         value={selectedBooking.pickupLocation.contactPhone}
//                         onChange={handleEditChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       />
//                     </div>
//                     {geoLoading.pickup && <p className="text-blue-500">Fetching coordinates...</p>}
//                     {!geoLoading.pickup && selectedBooking.pickupLocation.coordinates.latitude && (
//                       <div className="md:col-span-3">
//                         <p>Latitude: {selectedBooking.pickupLocation.coordinates.latitude}</p>
//                         <p>Longitude: {selectedBooking.pickupLocation.coordinates.longitude}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Delivery Location */}
//                 <div className="border rounded-lg p-4">
//                   <h3 className="text-lg font-semibold text-[#6A1B9A] mb-3">
//                     <FaMapMarkerAlt className="inline mr-2" />
//                     Delivery Location
//                   </h3>
//                   <div className="grid md:grid-cols-3 gap-4">
//                     <div className="md:col-span-2 relative">
//                       <input
//                         type="text"
//                         name="deliveryLocation.address"
//                         placeholder="Delivery Address"
//                         value={selectedBooking.deliveryLocation.address}
//                         onChange={handleEditChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                         required
//                       />
//                       {suggestions.delivery.length > 0 && (
//                         <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg">
//                           {suggestions.delivery.map((suggestion, index) => (
//                             <li
//                               key={index}
//                               className="p-2 hover:bg-gray-100 cursor-pointer"
//                               onClick={() => handleSuggestionSelect(suggestion, 'deliveryLocation', true)}
//                             >
//                               {suggestion.display_name}
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                       {error.delivery && <p className="text-red-500 mt-1">{error.delivery}</p>}
//                     </div>
//                     <div>
//                       <input
//                         type="text"
//                         name="deliveryLocation.contactPerson"
//                         placeholder="Contact Person"
//                         value={selectedBooking.deliveryLocation.contactPerson}
//                         onChange={handleEditChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       />
//                     </div>
//                     <div className="md:col-span-3">
//                       <input
//                         type="tel"
//                         name="deliveryLocation.contactPhone"
//                         placeholder="Contact Phone"
//                         value={selectedBooking.deliveryLocation.contactPhone}
//                         onChange={handleEditChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       />
//                     </div>
//                     {geoLoading.delivery && <p className="text-blue-500">Fetching coordinates...</p>}
//                     {!geoLoading.delivery && selectedBooking.deliveryLocation.coordinates.latitude && (
//                       <div className="md:col-span-3">
//                         <p>Latitude: {selectedBooking.deliveryLocation.coordinates.latitude}</p>
//                         <p>Longitude: {selectedBooking.deliveryLocation.coordinates.longitude}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Schedule & Cargo */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <FaCalendarAlt className="inline mr-2" />
//                       Scheduled Pickup
//                     </label>
//                     <input
//                       type="datetime-local"
//                       name="scheduledPickup"
//                       value={selectedBooking.scheduledPickup}
//                       onChange={handleEditChange}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Cargo Type
//                     </label>
//                     <select
//                       name="cargo.type"
//                       value={selectedBooking.cargo.type}
//                       onChange={handleEditChange}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                     >
//                       <option value="milk">Milk</option>
//                       <option value="dairy_products">Dairy Products</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Quantity */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Quantity
//                     </label>
//                     <input
//                       type="number"
//                       name="cargo.quantity"
//                       placeholder="Enter quantity"
//                       value={selectedBooking.cargo.quantity}
//                       onChange={handleEditChange}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Unit
//                     </label>
//                     <select
//                       name="cargo.unit"
//                       value={selectedBooking.cargo.unit}
//                       onChange={handleEditChange}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                     >
//                       <option value="liters">Liters</option>
//                       <option value="kg">Kilograms</option>
//                       <option value="tons">Tons</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Temperature Control */}
//                 <div className="border rounded-lg p-4">
//                   <div className="flex items-center mb-3">
//                     <input
//                       type="checkbox"
//                       name="cargo.temperature"
//                       checked={selectedBooking.cargo.temperature.required}
//                       onChange={handleEditChange}
//                       className="mr-2"
//                     />
//                     <label className="text-lg font-semibold text-[#6A1B9A]">
//                       <FaThermometerHalf className="inline mr-2" />
//                       Temperature Control Required
//                     </label>
//                   </div>

//                   {selectedBooking.cargo.temperature.required && (
//                     <div className="grid md:grid-cols-2 gap-4">
//                       <div>
//                         <input
//                           type="number"
//                           name="cargo.temperature.min"
//                           placeholder="Min Temperature (°C)"
//                           value={selectedBooking.cargo.temperature.min}
//                           onChange={(e) => setSelectedBooking(prev => ({
//                             ...prev,
//                             cargo: {
//                               ...prev.cargo,
//                               temperature: { ...prev.cargo.temperature, min: e.target.value }
//                             }
//                           }))}
//                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                         />
//                       </div>
//                       <div>
//                         <input
//                           type="number"
//                           name="cargo.temperature.max"
//                           placeholder="Max Temperature (°C)"
//                           value={selectedBooking.cargo.temperature.max}
//                           onChange={(e) => setSelectedBooking(prev => ({
//                             ...prev,
//                             cargo: {
//                               ...prev.cargo,
//                               temperature: { ...prev.cargo.temperature, max: e.target.value }
//                             }
//                           }))}
//                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Special Instructions */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Special Instructions
//                   </label>
//                   <textarea
//                     name="cargo.specialInstructions"
//                     placeholder="Any special handling requirements..."
//                     value={selectedBooking.cargo.specialInstructions}
//                     onChange={handleEditChange}
//                     rows="3"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <div className="flex justify-end space-x-4 pt-4 border-t">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowEditBookingForm(false);
//                       setSelectedBooking(null);
//                     }}
//                     className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={formLoading}
//                     className="px-6 py-3 bg-[#6A1B9A] text-white rounded-lg hover:bg-[#5A1A8A] disabled:opacity-50"
//                   >
//                     {formLoading ? 'Updating...' : 'Update Booking'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Assign Driver Form Modal */}
//         {showAssignDriverForm && selectedBooking && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-lg max-w-md w-full">
//               <div className="p-6 border-b">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-2xl font-bold text-[#6A1B9A]">Assign Driver for #{selectedBooking.bookingId}</h2>
//                   <button
//                     onClick={() => {
//                       setShowAssignDriverForm(false);
//                       setSelectedBooking(null);
//                       setAssignFormData({ driverId: '', vehicleId: '' });
//                     }}
//                     className="text-gray-500 hover:text-gray-700 text-2xl"
//                   >
//                     ×
//                   </button>
//                 </div>
//               </div>

//               <form onSubmit={handleAssignSubmit} className="p-6 space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     <FaUserCheck className="inline mr-2" />
//                     Select Driver
//                   </label>
//                   <select
//                     name="driverId"
//                     value={assignFormData.driverId}
//                     onChange={handleAssignChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                     required
//                   >
//                     <option value="">Select a driver</option>
//                     {drivers.map(driver => (
//                       <option key={driver._id} value={driver._id}>
//                         {driver.name} ({driver.email})
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     <FaTruck className="inline mr-2" />
//                     Select Vehicle
//                   </label>
//                   <select
//                     name="vehicleId"
//                     value={assignFormData.vehicleId}
//                     onChange={handleAssignChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                     required
//                   >
//                     <option value="">Select a vehicle</option>
//                     {vehicles.map(vehicle => (
//                       <option key={vehicle._id} value={vehicle._id}>
//                         {vehicle.type} ({vehicle.licensePlate})
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex justify-end space-x-4 pt-4 border-t">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowAssignDriverForm(false);
//                       setSelectedBooking(null);
//                       setAssignFormData({ driverId: '', vehicleId: '' });
//                     }}
//                     className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={formLoading}
//                     className="px-6 py-3 bg-[#6A1B9A] text-white rounded-lg hover:bg-[#5A1A8A] disabled:opacity-50"
//                   >
//                     {formLoading ? 'Assigning...' : 'Assign Driver'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Quote Form Modal */}
//         {showQuoteForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-2xl font-bold text-[#6A1B9A]">Calculate Quote</h2>
//                   <button
//                     onClick={() => { setShowQuoteForm(false); setQuote(null); }}
//                     className="text-gray-500 hover:text-gray-700 text-2xl"
//                   >
//                     ×
//                   </button>
//                 </div>
//               </div>

//               <form className="p-6 space-y-6">
//                 {/* Personal Info */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={quoteFormData.name}
//                       onChange={(e) => handleChange(e, true)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={quoteFormData.email}
//                       onChange={(e) => handleChange(e, true)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={quoteFormData.phone}
//                       onChange={(e) => handleChange(e, true)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
//                     <input
//                       type="text"
//                       name="companyName"
//                       value={quoteFormData.companyName}
//                       onChange={(e) => handleChange(e, true)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                     />
//                   </div>
//                 </div>

//                 {/* Quote Details */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <FaTruck className="inline mr-2" />
//                       Service Type
//                     </label>
//                     <select
//                       name="serviceType"
//                       value={quoteFormData.serviceType}
//                       onChange={(e) => handleChange(e, true)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     >
//                       <option value="bulk_transport">Bulk Transport</option>
//                       <option value="cold_chain">Cold Chain</option>
//                       <option value="express_delivery">Express Delivery</option>
//                       <option value="scheduled_pickup">Scheduled Pickup</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Vehicle Type
//                     </label>
//                     <select
//                       name="vehicleType"
//                       value={quoteFormData.vehicleType}
//                       onChange={(e) => handleChange(e, true)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     >
//                       <option value="16ft_truck">16ft Truck</option>
//                       <option value="19ft_truck">19ft Truck</option>
//                       <option value="pickup_truck">Pickup Truck</option>
//                       <option value="refrigerated_truck">Refrigerated Truck</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <FaMapMarkerAlt className="inline mr-2" />
//                       Pickup Location
//                     </label>
//                     <input
//                       type="text"
//                       name="pickupLocation"
//                       value={quoteFormData.pickupLocation}
//                       onChange={(e) => handleChange(e, true)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <FaMapMarkerAlt className="inline mr-2" />
//                       Delivery Location
//                     </label>
//                     <input
//                       type="text"
//                       name="deliveryLocation"
//                       value={quoteFormData.deliveryLocation}
//                       onChange={(e) => handleChange(e, true)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Cargo Details
//                     </label>
//                     <input
//                       type="text"
//                       name="cargoDetails"
//                       value={quoteFormData.cargoDetails}
//                       onChange={(e) => handleChange(e, true)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <FaCalendarAlt className="inline mr-2" />
//                       Scheduled Date
//                     </label>
//                     <input
//                       type="date"
//                       name="scheduledDate"
//                       value={quoteFormData.scheduledDate}
//                       onChange={(e) => handleChange(e, true)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Calculate and Request Buttons */}
//                 <div className="flex justify-end space-x-4 pt-4 border-t">
//                   <button
//                     type="button"
//                     onClick={calculateQuote}
//                     className="px-6 py-3 bg-[#6A1B9A] text-white rounded-lg hover:bg-[#5A1A8A]"
//                   >
//                     Calculate
//                   </button>
//                   {quote && (
//                     <button
//                       type="button"
//                       onClick={requestQuote}
//                       className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                     >
//                       Request Quote
//                     </button>
//                   )}
//                   <button
//                     type="button"
//                     onClick={() => { setShowQuoteForm(false); setQuote(null); }}
//                     className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                 </div>

//                 {/* Quote Result */}
//                 {quote && (
//                   <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//                     <h3 className="text-lg font-semibold text-[#6A1B9A] mb-2">Quote Summary</h3>
//                     <p><strong>Total Amount:</strong> ₹{quote.totalAmount.toLocaleString()}</p>
//                     <p><strong>Base Rate:</strong> ₹{quote.baseRate.toLocaleString()}</p>
//                     <p><strong>Distance Rate:</strong> ₹{quote.distanceRate.toLocaleString()}</p>
//                     <p><strong>Temperature Control Rate:</strong> ₹{quote.temperatureControlRate}</p>
//                     <p><small>Valid until: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</small></p>
//                   </div>
//                 )}
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaTruck, 
  FaClipboardList, 
  FaMapMarkerAlt, 
  FaUser, 
  FaPlus,
  FaEye,
  FaEdit,
  FaSearch,
  FaFilter,
  FaThermometerHalf,
  FaCalendarAlt,
  FaDollarSign,
  FaUserCheck
} from 'react-icons/fa';
import baseurl from '../utility/baseurl';
import { debounce } from 'lodash';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showEditBookingForm, setShowEditBookingForm] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showAssignDriverForm, setShowAssignDriverForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [assignFormData, setAssignFormData] = useState({ driverId: '', vehicleId: '' });
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [quote, setQuote] = useState(null);
  const [geoLoading, setGeoLoading] = useState({ pickup: false, delivery: false });
  const [suggestions, setSuggestions] = useState({ pickup: [], delivery: [] });
  const [error, setError] = useState({ pickup: '', delivery: '' });
  const [formLoading, setFormLoading] = useState(false);

  // Booking Form State
  const [formData, setFormData] = useState({
    serviceType: 'bulk_transport',
    vehicleType: '16ft_truck',
    pickupLocation: {
      address: '',
      contactPerson: '',
      contactPhone: '',
      coordinates: { latitude: '', longitude: '' }
    },
    deliveryLocation: {
      address: '',
      contactPerson: '',
      contactPhone: '',
      coordinates: { latitude: '', longitude: '' }
    },
    scheduledPickup: '',
    cargo: {
      type: 'milk',
      quantity: '',
      unit: 'liters',
      temperature: {
        required: false,
        min: '',
        max: ''
      },
      specialInstructions: ''
    }
  });

  // Quote Form State
  const [quoteFormData, setQuoteFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    companyName: '',
    serviceType: 'bulk_transport',
    vehicleType: '16ft_truck',
    pickupLocation: '',
    deliveryLocation: '',
    cargoDetails: '1000 liters of milk',
    scheduledDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchDashboardData();
    if (['admin', 'manager'].includes(user?.role)) {
      fetchDriversAndVehicles();
    }
  }, [user?.role]);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        fetch(`${baseurl}/api/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${baseurl}/api/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings);
      } else {
        throw new Error('Failed to fetch bookings');
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      } else {
        throw new Error('Failed to fetch stats');
      }
    } catch (error) {
      toast.error('Error fetching dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriversAndVehicles = async () => {
    try {
      const [driversRes, vehiclesRes] = await Promise.all([
        fetch(`${baseurl}/api/drivers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${baseurl}/api/vehicles`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (driversRes.ok) {
        const driversData = await driversRes.json();
        setDrivers(driversData.drivers);
        console.log(driversData.drivers);
      } else {
        throw new Error('Failed to fetch drivers');
      }

      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json();
        setVehicles(vehiclesData);
        console.log(vehiclesData);
      } else {
        throw new Error('Failed to fetch vehicles');
      }
    } catch (error) {
      toast.error('Error fetching drivers/vehicles: ' + error.message);
    }
  };

  const fetchCoordinates = debounce(async (address, locationType, isEditForm = false) => {
    const key = locationType === 'pickupLocation' ? 'pickup' : 'delivery';
    setGeoLoading(prev => ({ ...prev, [key]: true }));
    setError(prev => ({ ...prev, [key]: '' }));
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${encodeURIComponent(address)}&format=json`
      );
      if (!response.ok) {
        if (response.status === 401) throw new Error('Invalid API key');
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        if (isEditForm) {
          setSelectedBooking(prev => ({
            ...prev,
            [locationType]: {
              ...prev[locationType],
              coordinates: { latitude: parseFloat(lat), longitude: parseFloat(lon) }
            }
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            [locationType]: {
              ...prev[locationType],
              coordinates: { latitude: parseFloat(lat), longitude: parseFloat(lon) }
            }
          }));
        }
      } else {
        setError(prev => ({ ...prev, [key]: 'No coordinates found for this address' }));
      }
    } catch (error) {
      setError(prev => ({ ...prev, [key]: error.message }));
    } finally {
      setGeoLoading(prev => ({ ...prev, [key]: false }));
    }
  }, 300);

  const fetchSuggestions = async (query, locationType) => {
    const key = locationType === 'pickupLocation' ? 'pickup' : 'delivery';
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/autocomplete.php?key=pk.4ebcc4fec220d7040d681509bbb07232&q=${encodeURIComponent(query)}&format=json&limit=5`
      );
      if (!response.ok) {
        if (response.status === 401) throw new Error('Invalid API key');
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSuggestions(prev => ({
        ...prev,
        [key]: data
      }));
    } catch (error) {
      setSuggestions(prev => ({ ...prev, [key]: [] }));
      setError(prev => ({ ...prev, [key]: error.message }));
    }
  };

  const handleChange = (e, isQuoteForm = false) => {
    const { name, value } = e.target;
    const data = isQuoteForm ? quoteFormData : formData;
    const setData = isQuoteForm ? setQuoteFormData : setFormData;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'cargo' && child === 'temperature') {
        setData(prev => ({
          ...prev,
          cargo: {
            ...prev.cargo,
            temperature: {
              ...prev.cargo.temperature,
              required: e.target.checked
            }
          }
        }));
      } else if (parent === 'pickupLocation' || parent === 'deliveryLocation') {
        setData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
        if (child === 'address' && value.length > 2) {
          fetchSuggestions(value, parent);
          fetchCoordinates(value, parent);
        } else {
          setSuggestions(prev => ({ ...prev, [parent === 'pickupLocation' ? 'pickup' : 'delivery']: [] }));
        }
      } else {
        setData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'cargo' && child === 'temperature') {
        setSelectedBooking(prev => ({
          ...prev,
          cargo: {
            ...prev.cargo,
            temperature: {
              ...prev.cargo.temperature,
              required: e.target.checked
            }
          }
        }));
      } else if (parent === 'pickupLocation' || parent === 'deliveryLocation') {
        setSelectedBooking(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
        if (child === 'address' && value.length > 2) {
          fetchSuggestions(value, parent);
          fetchCoordinates(value, parent, true);
        } else {
          setSuggestions(prev => ({ ...prev, [parent === 'pickupLocation' ? 'pickup' : 'delivery']: [] }));
        }
      } else {
        setSelectedBooking(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setSelectedBooking(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAssignChange = (e) => {
    const { name, value } = e.target;
    setAssignFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSuggestionSelect = (suggestion, locationType, isEditForm = false) => {
    const [parent] = locationType.split('.');
    const setData = isEditForm ? setSelectedBooking : setFormData;
    setData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        address: suggestion.display_name,
        coordinates: { latitude: parseFloat(suggestion.lat), longitude: parseFloat(suggestion.lon) }
      }
    }));
    setSuggestions(prev => ({ ...prev, [parent === 'pickupLocation' ? 'pickup' : 'delivery']: [] }));
    setError(prev => ({ ...prev, [parent === 'pickupLocation' ? 'pickup' : 'delivery']: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const response = await fetch(`${baseurl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setBookings(prev => [data.booking, ...prev]);
        setShowBookingForm(false);
        setFormData({
          serviceType: 'bulk_transport',
          vehicleType: '16ft_truck',
          pickupLocation: {
            address: '',
            contactPerson: '',
            contactPhone: '',
            coordinates: { latitude: '', longitude: '' }
          },
          deliveryLocation: {
            address: '',
            contactPerson: '',
            contactPhone: '',
            coordinates: { latitude: '', longitude: '' }
          },
          scheduledPickup: '',
          cargo: {
            type: 'milk',
            quantity: '',
            unit: 'liters',
            temperature: {
              required: false,
              min: '',
              max: ''
            },
            specialInstructions: ''
          }
        });
        toast.success('Booking created successfully!');
      } else {
        toast.error(data.error || 'Failed to create booking');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const response = await fetch(`${baseurl}/api/bookings/${selectedBooking._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedBooking)
      });

      const data = await response.json();

      if (response.ok) {
        setBookings(prev => prev.map(b => b._id === selectedBooking._id ? data.booking : b));
        setShowEditBookingForm(false);
        setSelectedBooking(null);
        toast.success('Booking updated successfully!');
      } else {
        toast.error(data.error || 'Failed to update booking');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    // Validate inputs
    if (!assignFormData.driverId || !assignFormData.vehicleId) {
      toast.error('Please select both a driver and a vehicle.');
      setFormLoading(false);
      return;
    }

    try {
      // Optimistic update
      const previousBookings = [...bookings];
      const updatedBooking = {
        ...selectedBooking,
        driverId: assignFormData.driverId,
        vehicleId: assignFormData.vehicleId,
        status: 'assigned'
      };
      setBookings(prev => prev.map(b => b._id === selectedBooking._id ? updatedBooking : b));

      const response = await fetch(`${baseurl}/api/bookings/${selectedBooking._id}/assign`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          driverId: assignFormData.driverId,
          vehicleId: assignFormData.vehicleId
        })
      });

      const data = await response.json();

      if (response.ok) {
        setBookings(prev => prev.map(b => b._id === selectedBooking._id ? data.booking : b));
        setShowAssignDriverForm(false);
        setSelectedBooking(null);
        setAssignFormData({ driverId: '', vehicleId: '' });
        toast.success('Driver and vehicle assigned successfully!');
      } else {
        // Rollback optimistic update
        setBookings(previousBookings);
        if (response.status === 400) {
          toast.error(data.error || 'Invalid driver or vehicle selection.');
        } else if (response.status === 404) {
          toast.error('Booking, driver, or vehicle not found.');
        } else if (response.status === 409) {
          toast.error(data.error || 'Driver or vehicle is already assigned to another booking.');
        } else {
          toast.error(data.error || 'Failed to assign driver and vehicle.');
        }
      }
    } catch (error) {
      // Rollback optimistic update
      setBookings(previousBookings);
      toast.error('Network error. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const calculateQuote = async () => {
    try {
      const response = await fetch(
        `${baseurl}/api/calculate-quote?serviceType=${quoteFormData.serviceType}&vehicleType=${quoteFormData.vehicleType}&pickupLocation=${encodeURIComponent(quoteFormData.pickupLocation)}&deliveryLocation=${encodeURIComponent(quoteFormData.deliveryLocation)}&cargoQuantity=${quoteFormData.cargoDetails}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error('Failed to calculate quote');
      const data = await response.json();
      setQuote(data.quote);
    } catch (error) {
      toast.error('Failed to calculate quote. Please try again.');
    }
  };

  const requestQuote = async () => {
    try {
      const response = await fetch(`${baseurl}/api/quote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quoteFormData)
      });
      if (!response.ok) throw new Error('Failed to request quote');
      const data = await response.json();
      toast.success(data.message);
      setShowQuoteForm(false);
      setQuote(null);
    } catch (error) {
      toast.error('Failed to request quote. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.pickupLocation.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.deliveryLocation.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6A1B9A]"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your transportation bookings and track deliveries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FaClipboardList className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <FaTruck className="text-orange-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Deliveries</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeBookings || 0}</p>
              </div>
            </div>
          </div>
          <div

 className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FaMapMarkerAlt className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Vehicles</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.availableVehicles || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaUser className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">₹{stats.totalRevenue?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: FaClipboardList },
                { id: 'bookings', label: 'My Bookings', icon: FaTruck },
                { id: 'profile', label: 'Profile', icon: FaUser }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-[#6A1B9A] text-[#6A1B9A]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                <div className="space-x-4">
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="bg-[#6A1B9A] text-white px-4 py-2 rounded-lg hover:bg-[#5A1A8A] flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    New Booking
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">Recent Activity</h3>
                  <p className="text-gray-600 text-sm">View your latest bookings and deliveries</p>
                  <button 
                    onClick={() => setActiveTab('bookings')}
                    className="mt-3 text-[#6A1B9A] hover:text-[#5A1A8A] font-medium"
                  >
                    View All →
                  </button>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">Track Delivery</h3>
                  <p className="text-gray-600 text-sm">Real-time tracking of your shipments</p>
                  <button className="mt-3 text-[#6A1B9A] hover:text-[#5A1A8A] font-medium">
                    Track Now →
                  </button>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">Get Quote</h3>
                  <p className="text-gray-600 text-sm">Calculate pricing for your next shipment</p>
                  <button
                    onClick={() => setShowQuoteForm(true)}
                    className="mt-3 text-[#6A1B9A] hover:text-[#5A1A8A] font-medium"
                  >
                    Calculate →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="bg-[#6A1B9A] text-white px-4 py-2 rounded-lg hover:bg-[#5A1A8A] flex items-center"
                >
                  <FaPlus className="mr-2" />
                  New Booking
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                  />
                </div>
                <div className="relative">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Bookings List */}
              <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <FaClipboardList className="mx-auto text-gray-400 text-4xl mb-4" />
                    <p className="text-gray-600">No bookings found</p>
                    <button
                      onClick={() => setShowBookingForm(true)}
                      className="mt-4 bg-[#6A1B9A] text-white px-4 py-2 rounded-lg hover:bg-[#5A1A8A]"
                    >
                      Create Your First Booking
                    </button>
                  </div>
                ) : (
                  filteredBookings.map(booking => (
                    <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">#{booking.bookingId}</h3>
                          <p className="text-sm text-gray-600">{booking.serviceType.replace('_', ' ').toUpperCase()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">From:</p>
                          <p className="font-medium">{booking.pickupLocation.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">To:</p>
                          <p className="font-medium">{booking.deliveryLocation.address}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">
                            Scheduled: {new Date(booking.scheduledPickup).toLocaleDateString()}
                          </p>
                          <p className="font-semibold text-[#6A1B9A]">
                            ₹{booking.pricing.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-600 hover:text-[#6A1B9A]">
                            <FaEye />
                          </button>
                          {booking.status === 'pending' && (
                            <button 
                              onClick={() => {
                                setSelectedBooking({
                                  ...booking,
                                  scheduledPickup: new Date(booking.scheduledPickup).toISOString().slice(0, 16)
                                });
                                setShowEditBookingForm(true);
                              }}
                              className="p-2 text-gray-600 hover:text-[#6A1B9A]"
                            >
                              <FaEdit />
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowAssignDriverForm(true);
                              fetchDriversAndVehicles();
                            }}
                            className="p-2 text-gray-600 hover:text-[#6A1B9A]"
                          >
                            <FaUserCheck />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
              <div className="max-w-md">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={user?.role || ''}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#6A1B9A]">Create New Booking</h2>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Service & Vehicle Type */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaTruck className="inline mr-2" />
                      Service Type
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={(e) => handleChange(e)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    >
                      <option value="bulk_transport">Bulk Transport</option>
                      <option value="cold_chain">Cold Chain</option>
                      <option value="express_delivery">Express Delivery</option>
                      <option value="scheduled_pickup">Scheduled Pickup</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={(e) => handleChange(e)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    >
                      <option value="16ft_truck">16ft Truck</option>
                      <option value="19ft_truck">19ft Truck</option>
                      <option value="pickup_truck">Pickup Truck</option>
                      <option value="refrigerated_truck">Refrigerated Truck</option>
                    </select>
                  </div>
                </div>

                {/* Pickup Location */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-[#6A1B9A] mb-3">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Pickup Location
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative">
                      <input
                        type="text"
                        name="pickupLocation.address"
                        placeholder="Pickup Address"
                        value={formData.pickupLocation.address}
                        onChange={(e) => handleChange(e)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                        required
                      />
                      {suggestions.pickup.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg">
                          {suggestions.pickup.map((suggestion, index) => (
                            <li
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSuggestionSelect(suggestion, 'pickupLocation')}
                            >
                              {suggestion.display_name}
                            </li>
                          ))}
                        </ul>
                      )}
                      {error.pickup && <p className="text-red-500 mt-1">{error.pickup}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="pickupLocation.contactPerson"
                        placeholder="Contact Person"
                        value={formData.pickupLocation.contactPerson}
                        onChange={(e) => handleChange(e)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <input
                        type="tel"
                        name="pickupLocation.contactPhone"
                        placeholder="Contact Phone"
                        value={formData.pickupLocation.contactPhone}
                        onChange={(e) => handleChange(e)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      />
                    </div>
                    {geoLoading.pickup && <p className="text-blue-500">Fetching coordinates...</p>}
                    {!geoLoading.pickup && formData.pickupLocation.coordinates.latitude && (
                      <div className="md:col-span-3">
                        <p>Latitude: {formData.pickupLocation.coordinates.latitude}</p>
                        <p>Longitude: {formData.pickupLocation.coordinates.longitude}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Location */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-[#6A1B9A] mb-3">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Delivery Location
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative">
                      <input
                        type="text"
                        name="deliveryLocation.address"
                        placeholder="Delivery Address"
                        value={formData.deliveryLocation.address}
                        onChange={(e) => handleChange(e)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                        required
                      />
                      {suggestions.delivery.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg">
                          {suggestions.delivery.map((suggestion, index) => (
                            <li
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSuggestionSelect(suggestion, 'deliveryLocation')}
                            >
                              {suggestion.display_name}
                            </li>
                          ))}
                        </ul>
                      )}
                      {error.delivery && <p className="text-red-500 mt-1">{error.delivery}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="deliveryLocation.contactPerson"
                        placeholder="Contact Person"
                        value={formData.deliveryLocation.contactPerson}
                        onChange={(e) => handleChange(e)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <input
                        type="tel"
                        name="deliveryLocation.contactPhone"
                        placeholder="Contact Phone"
                        value={formData.deliveryLocation.contactPhone}
                        onChange={(e) => handleChange(e)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      />
                    </div>
                    {geoLoading.delivery && <p className="text-blue-500">Fetching coordinates...</p>}
                    {!geoLoading.delivery && formData.deliveryLocation.coordinates.latitude && (
                      <div className="md:col-span-3">
                        <p>Latitude: {formData.deliveryLocation.coordinates.latitude}</p>
                        <p>Longitude: {formData.deliveryLocation.coordinates.longitude}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Schedule & Cargo */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2" />
                      Scheduled Pickup
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduledPickup"
                      value={formData.scheduledPickup}
                      onChange={(e) => handleChange(e)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cargo Type
                    </label>
                    <select
                      name="cargo.type"
                      value={formData.cargo.type}
                      onChange={(e) => handleChange(e)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                    >
                      <option value="milk">Milk</option>
                      <option value="dairy_products">Dairy Products</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Quantity */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="cargo.quantity"
                      placeholder="Enter quantity"
                      value={formData.cargo.quantity}
                      onChange={(e) => handleChange(e)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      name="cargo.unit"
                      value={formData.cargo.unit}
                      onChange={(e) => handleChange(e)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                    >
                      <option value="liters">Liters</option>
                      <option value="kg">Kilograms</option>
                      <option value="tons">Tons</option>
                    </select>
                  </div>
                </div>

                {/* Temperature Control */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      name="cargo.temperature"
                      checked={formData.cargo.temperature.required}
                      onChange={(e) => handleChange(e)}
                      className="mr-2"
                    />
                    <label className="text-lg font-semibold text-[#6A1B9A]">
                      <FaThermometerHalf className="inline mr-2" />
                      Temperature Control Required
                    </label>
                  </div>

                  {formData.cargo.temperature.required && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="number"
                          name="cargo.temperature.min"
                          placeholder="Min Temperature (°C)"
                          value={formData.cargo.temperature.min}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            cargo: {
                              ...prev.cargo,
                              temperature: { ...prev.cargo.temperature, min: e.target.value }
                            }
                          }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="cargo.temperature.max"
                          placeholder="Max Temperature (°C)"
                          value={formData.cargo.temperature.max}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            cargo: {
                              ...prev.cargo,
                              temperature: { ...prev.cargo.temperature, max: e.target.value }
                            }
                          }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    name="cargo.specialInstructions"
                    placeholder="Any special handling requirements..."
                    value={formData.cargo.specialInstructions}
                    onChange={(e) => handleChange(e)}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-3 bg-[#6A1B9A] text-white rounded-lg hover:bg-[#5A1A8A] disabled:opacity-50"
                  >
                    {formLoading ? 'Creating...' : 'Create Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Booking Form Modal */}
        {showEditBookingForm && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#6A1B9A]">Edit Booking #{selectedBooking.bookingId}</h2>
                  <button
                    onClick={() => {
                      setShowEditBookingForm(false);
                      setSelectedBooking(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                {/* Service & Vehicle Type */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaTruck className="inline mr-2" />
                      Service Type
                    </label>
                    <select
                      name="serviceType"
                      value={selectedBooking.serviceType}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    >
                      <option value="bulk_transport">Bulk Transport</option>
                      <option value="cold_chain">Cold Chain</option>
                      <option value="express_delivery">Express Delivery</option>
                      <option value="scheduled_pickup">Scheduled Pickup</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <select
                      name="vehicleType"
                      value={selectedBooking.vehicleType}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    >
                      <option value="16ft_truck">16ft Truck</option>
                      <option value="19ft_truck">19ft Truck</option>
                      <option value="pickup_truck">Pickup Truck</option>
                      <option value="refrigerated_truck">Refrigerated Truck</option>
                    </select>
                  </div>
                </div>

                {/* Pickup Location */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-[#6A1B9A] mb-3">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Pickup Location
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative">
                      <input
                        type="text"
                        name="pickupLocation.address"
                        placeholder="Pickup Address"
                        value={selectedBooking.pickupLocation.address}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                        required
                      />
                      {suggestions.pickup.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg">
                          {suggestions.pickup.map((suggestion, index) => (
                            <li
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSuggestionSelect(suggestion, 'pickupLocation', true)}
                            >
                              {suggestion.display_name}
                            </li>
                          ))}
                        </ul>
                      )}
                      {error.pickup && <p className="text-red-500 mt-1">{error.pickup}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="pickupLocation.contactPerson"
                        placeholder="Contact Person"
                        value={selectedBooking.pickupLocation.contactPerson}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <input
                        type="tel"
                        name="pickupLocation.contactPhone"
                        placeholder="Contact Phone"
                        value={selectedBooking.pickupLocation.contactPhone}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      />
                    </div>
                    {geoLoading.pickup && <p className="text-blue-500">Fetching coordinates...</p>}
                    {!geoLoading.pickup && selectedBooking.pickupLocation.coordinates.latitude && (
                      <div className="md:col-span-3">
                        <p>Latitude: {selectedBooking.pickupLocation.coordinates.latitude}</p>
                        <p>Longitude: {selectedBooking.pickupLocation.coordinates.longitude}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Location */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-[#6A1B9A] mb-3">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Delivery Location
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative">
                      <input
                        type="text"
                        name="deliveryLocation.address"
                        placeholder="Delivery Address"
                        value={selectedBooking.deliveryLocation.address}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                        required
                      />
                      {suggestions.delivery.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg">
                          {suggestions.delivery.map((suggestion, index) => (
                            <li
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSuggestionSelect(suggestion, 'deliveryLocation', true)}
                            >
                              {suggestion.display_name}
                            </li>
                          ))}
                        </ul>
                      )}
                      {error.delivery && <p className="text-red-500 mt-1">{error.delivery}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="deliveryLocation.contactPerson"
                        placeholder="Contact Person"
                        value={selectedBooking.deliveryLocation.contactPerson}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <input
                        type="tel"
                        name="deliveryLocation.contactPhone"
                        placeholder="Contact Phone"
                        value={selectedBooking.deliveryLocation.contactPhone}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      />
                    </div>
                    {geoLoading.delivery && <p className="text-blue-500">Fetching coordinates...</p>}
                    {!geoLoading.delivery && selectedBooking.deliveryLocation.coordinates.latitude && (
                      <div className="md:col-span-3">
                        <p>Latitude: {selectedBooking.deliveryLocation.coordinates.latitude}</p>
                        <p>Longitude: {selectedBooking.deliveryLocation.coordinates.longitude}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Schedule & Cargo */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2" />
                      Scheduled Pickup
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduledPickup"
                      value={selectedBooking.scheduledPickup}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cargo Type
                    </label>
                    <select
                      name="cargo.type"
                      value={selectedBooking.cargo.type}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                    >
                      <option value="milk">Milk</option>
                      <option value="dairy_products">Dairy Products</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Quantity */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="cargo.quantity"
                      placeholder="Enter quantity"
                      value={selectedBooking.cargo.quantity}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      name="cargo.unit"
                      value={selectedBooking.cargo.unit}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                    >
                      <option value="liters">Liters</option>
                      <option value="kg">Kilograms</option>
                      <option value="tons">Tons</option>
                    </select>
                  </div>
                </div>

                {/* Temperature Control */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      name="cargo.temperature"
                      checked={selectedBooking.cargo.temperature.required}
                      onChange={handleEditChange}
                      className="mr-2"
                    />
                    <label className="text-lg font-semibold text-[#6A1B9A]">
                      <FaThermometerHalf className="inline mr-2" />
                      Temperature Control Required
                    </label>
                  </div>

                  {selectedBooking.cargo.temperature.required && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="number"
                          name="cargo.temperature.min"
                          placeholder="Min Temperature (°C)"
                          value={selectedBooking.cargo.temperature.min}
                          onChange={(e) => setSelectedBooking(prev => ({
                            ...prev,
                            cargo: {
                              ...prev.cargo,
                              temperature: { ...prev.cargo.temperature, min: e.target.value }
                            }
                          }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="cargo.temperature.max"
                          placeholder="Max Temperature (°C)"
                          value={selectedBooking.cargo.temperature.max}
                          onChange={(e) => setSelectedBooking(prev => ({
                            ...prev,
                            cargo: {
                              ...prev.cargo,
                              temperature: { ...prev.cargo.temperature, max: e.target.value }
                            }
                          }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    name="cargo.specialInstructions"
                    placeholder="Any special handling requirements..."
                    value={selectedBooking.cargo.specialInstructions}
                    onChange={handleEditChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditBookingForm(false);
                      setSelectedBooking(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-3 bg-[#6A1B9A] text-white rounded-lg hover:bg-[#5A1A8A] disabled:opacity-50"
                  >
                    {formLoading ? 'Updating...' : 'Update Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assign Driver Form Modal */}
        {showAssignDriverForm && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#6A1B9A]">Assign Driver for #{selectedBooking.bookingId}</h2>
                  <button
                    onClick={() => {
                      setShowAssignDriverForm(false);
                      setSelectedBooking(null);
                      setAssignFormData({ driverId: '', vehicleId: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <form onSubmit={handleAssignSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUserCheck className="inline mr-2" />
                    Select Driver
                  </label>
                  <select
                    name="driverId"
                    value={assignFormData.driverId}
                    onChange={handleAssignChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                    required
                  >
                    <option value="">Select a driver</option>
                    {drivers.map(driver => (
                      <option key={driver._id} value={driver._id}>
                        {driver.name} ({driver.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaTruck className="inline mr-2" />
                    Select Vehicle
                  </label>
                  <select
                    name="vehicleId"
                    value={assignFormData.vehicleId}
                    onChange={handleAssignChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                    required
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle._id} value={vehicle._id}>
                        {vehicle.type} ({vehicle.licensePlate})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAssignDriverForm(false);
                      setSelectedBooking(null);
                      setAssignFormData({ driverId: '', vehicleId: '' });
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-3 bg-[#6A1B9A] text-white rounded-lg hover:bg-[#5A1A8A] disabled:opacity-50"
                  >
                    {formLoading ? 'Assigning...' : 'Assign Driver'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Quote Form Modal */}
        {showQuoteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#6A1B9A]">Calculate Quote</h2>
                  <button
                    onClick={() => { setShowQuoteForm(false); setQuote(null); }}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <form className="p-6 space-y-6">
                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={quoteFormData.name}
                      onChange={(e) => handleChange(e, true)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={quoteFormData.email}
                      onChange={(e) => handleChange(e, true)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={quoteFormData.phone}
                      onChange={(e) => handleChange(e, true)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={quoteFormData.companyName}
                      onChange={(e) => handleChange(e, true)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                    />
                  </div>
                </div>

                {/* Quote Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaTruck className="inline mr-2" />
                      Service Type
                    </label>
                    <select
                      name="serviceType"
                      value={quoteFormData.serviceType}
                      onChange={(e) => handleChange(e, true)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    >
                      <option value="bulk_transport">Bulk Transport</option>
                      <option value="cold_chain">Cold Chain</option>
                      <option value="express_delivery">Express Delivery</option>
                      <option value="scheduled_pickup">Scheduled Pickup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <select
                      name="vehicleType"
                      value={quoteFormData.vehicleType}
                      onChange={(e) => handleChange(e, true)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    >
                      <option value="16ft_truck">16ft Truck</option>
                      <option value="19ft_truck">19ft Truck</option>
                      <option value="pickup_truck">Pickup Truck</option>
                      <option value="refrigerated_truck">Refrigerated Truck</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaMapMarkerAlt className="inline mr-2" />
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={quoteFormData.pickupLocation}
                      onChange={(e) => handleChange(e, true)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaMapMarkerAlt className="inline mr-2" />
                      Delivery Location
                    </label>
                    <input
                      type="text"
                      name="deliveryLocation"
                      value={quoteFormData.deliveryLocation}
                      onChange={(e) => handleChange(e, true)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cargo Details
                    </label>
                    <input
                      type="text"
                      name="cargoDetails"
                      value={quoteFormData.cargoDetails}
                      onChange={(e) => handleChange(e, true)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2" />
                      Scheduled Date
                    </label>
                    <input
                      type="date"
                      name="scheduledDate"
                      value={quoteFormData.scheduledDate}
                      onChange={(e) => handleChange(e, true)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                      required
                    />
                  </div>
                </div>

                {/* Calculate and Request Buttons */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={calculateQuote}
                    className="px-6 py-3 bg-[#6A1B9A] text-white rounded-lg hover:bg-[#5A1A8A]"
                  >
                    Calculate
                  </button>
                  {quote && (
                    <button
                      type="button"
                      onClick={requestQuote}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Request Quote
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setShowQuoteForm(false); setQuote(null); }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>

                {/* Quote Result */}
                {quote && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#6A1B9A] mb-2">Quote Summary</h3>
                    <p><strong>Total Amount:</strong> ₹{quote.totalAmount.toLocaleString()}</p>
                    <p><strong>Base Rate:</strong> ₹{quote.baseRate.toLocaleString()}</p>
                    <p><strong>Distance Rate:</strong> ₹{quote.distanceRate.toLocaleString()}</p>
                    <p><strong>Temperature Control Rate:</strong> ₹{quote.temperatureControlRate}</p>
                    <p><small>Valid until: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</small></p>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;