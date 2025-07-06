 
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import baseurl from '../utility/baseurl';

// const AdminDashboard = () => {
//   const [trucks, setTrucks] = useState([]);
//   const [truckData, setTruckData] = useState({ number: '', type: '', capacity: '' });
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchTrucks();
//   }, []);

//   const fetchTrucks = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${baseurl}/api/vehicles`);
//       setTrucks(res.data);
//       setError('');
//     } catch (err) {
//       setError('Failed to fetch trucks');
//     }
//     setLoading(false);
//   };

//   const handleChange = (e) => {
//     setTruckData({ ...truckData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleAddTruck = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('number', truckData.number);
//       formData.append('type', truckData.type);
//       formData.append('capacity', truckData.capacity);
//       if (image) {
//         formData.append('image', image);
//       }
//       await axios.post(`${baseurl}/api/vehicles`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setTruckData({ number: '', type: '', capacity: '' });
//       setImage(null);
//       fetchTrucks();
//       setError('');
//     } catch (err) {
//       setError('Failed to add truck');
//     }
//     setLoading(false);
//   };

//   const handleDeleteTruck = async (id) => {
//     setLoading(true);
//     try {
//       await axios.delete(`${baseurl}/api/vehicles/${id}`);
//       fetchTrucks();
//       setError('');
//     } catch (err) {
//       setError('Failed to delete truck');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
//       <section className="mb-8">
//         <h2 className="text-xl font-semibold mb-2">Add Truck</h2>
//         <form onSubmit={handleAddTruck} className="flex flex-col gap-2 bg-gray-100 p-4 rounded" encType="multipart/form-data">
//           <input
//             type="text"
//             name="number"
//             placeholder="Truck Number"
//             value={truckData.number}
//             onChange={handleChange}
//             required
//             className="p-2 border rounded"
//           />
//           <input
//             type="text"
//             name="type"
//             placeholder="Truck Type"
//             value={truckData.type}
//             onChange={handleChange}
//             required
//             className="p-2 border rounded"
//           />
//           <input
//             type="number"
//             name="capacity"
//             placeholder="Capacity (litres)"
//             value={truckData.capacity}
//             onChange={handleChange}
//             required
//             className="p-2 border rounded"
//           />
//           <input
//             type="file"
//             name="image"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="p-2 border rounded"
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             disabled={loading}
//           >
//             {loading ? 'Adding...' : 'Add Truck'}
//           </button>
//         </form>
//       </section>

//       <section>
//         <h2 className="text-xl font-semibold mb-2">Truck List</h2>
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <table className="w-full border">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="p-2 border">Number</th>
//                 <th className="p-2 border">Type</th>
//                 <th className="p-2 border">Capacity</th>
//                 <th className="p-2 border">Image</th>
//                 <th className="p-2 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {trucks.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center p-2">No trucks found.</td>
//                 </tr>
//               ) : (
//                 trucks.map((truck) => (
//                   <tr key={truck._id}>
//                     <td className="p-2 border">{truck.number}</td>
//                     <td className="p-2 border">{truck.type}</td>
//                     <td className="p-2 border">{truck.capacity}</td>
//                     <td className="p-2 border">
//                       {truck.image ? (
//                         <img src={`${baseurl}${truck.image}`} alt="truck" className="w-16 h-12 object-cover" />
//                       ) : (
//                         'No Image'
//                       )}
//                     </td>
//                     <td className="p-2 border">
//                       <button
//                         onClick={() => handleDeleteTruck(truck._id)}
//                         className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
//                         disabled={loading}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         )}
//         {error && <p className="text-red-600 mt-2">{error}</p>}
//       </section>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import baseurl from '../utility/baseurl';

const AdminDashboard = () => {
  const [trucks, setTrucks] = useState([]);
  const [truckData, setTruckData] = useState({
    number: '',
    type: '',
    capacity: '',
    wheels: '',
    year: '',
    registrationNumber: '',
    ownerContact: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseurl}/api/vehicles`);
      setTrucks(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch trucks');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setTruckData({ ...truckData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddTruck = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(truckData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (image) {
        formData.append('image', image);
      }
      await axios.post(`${baseurl}/api/vehicles`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTruckData({
        number: '',
        type: '',
        capacity: '',
        wheels: '',
        year: '',
        registrationNumber: '',
        ownerContact: ''
      });
      setImage(null);
      fetchTrucks();
      setError('');
    } catch (err) {
      setError('Failed to add truck');
    }
    setLoading(false);
  };

  const handleDeleteTruck = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${baseurl}/api/vehicles/${id}`);
      fetchTrucks();
      setError('');
    } catch (err) {
      setError('Failed to delete truck');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add Truck</h2>
        <form onSubmit={handleAddTruck} className="flex flex-col gap-2 bg-gray-100 p-4 rounded" encType="multipart/form-data">
          <input type="text" name="number" placeholder="Truck Number" value={truckData.number} onChange={handleChange} required className="p-2 border rounded" />
          <input type="text" name="type" placeholder="Truck Type" value={truckData.type} onChange={handleChange} required className="p-2 border rounded" />
          <input type="number" name="capacity" placeholder="Capacity (litres)" value={truckData.capacity} onChange={handleChange} required className="p-2 border rounded" />
          <input type="number" name="wheels" placeholder="Number of Wheels" value={truckData.wheels} onChange={handleChange} required className="p-2 border rounded" />
          <input type="number" name="year" placeholder="Manufacturing Year" value={truckData.year} onChange={handleChange} required className="p-2 border rounded" />
          <input type="text" name="registrationNumber" placeholder="Registration Number" value={truckData.registrationNumber} onChange={handleChange} required className="p-2 border rounded" />
          <input type="text" name="ownerContact" placeholder="Owner Contact Number" value={truckData.ownerContact} onChange={handleChange} required className="p-2 border rounded" />
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="p-2 border rounded" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>
            {loading ? 'Adding...' : 'Add Truck'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Truck List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Number</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Capacity</th>
                <th className="p-2 border">Wheels</th>
                <th className="p-2 border">Year</th>
                <th className="p-2 border">Registration</th>
                <th className="p-2 border">Owner Contact</th>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trucks.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center p-2">No trucks found.</td>
                </tr>
              ) : (
                trucks.map((truck) => (
                  <tr key={truck._id}>
                    <td className="p-2 border">{truck.number}</td>
                    <td className="p-2 border">{truck.type}</td>
                    <td className="p-2 border">{truck.capacity}</td>
                    <td className="p-2 border">{truck.wheels}</td>
                    <td className="p-2 border">{truck.year}</td>
                    <td className="p-2 border">{truck.registrationNumber}</td>
                    <td className="p-2 border">{truck.ownerContact}</td>
                    <td className="p-2 border">
                      {truck.image ? (
                        <img src={`${baseurl}${truck.image}`} alt="truck" className="w-16 h-12 object-cover" />
                      ) : (
                        'No Image'
                      )}
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleDeleteTruck(truck._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </section>
    </div>
  );
};

export default AdminDashboard;