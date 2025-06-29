 
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaThermometerHalf } from 'react-icons/fa';

const BookingForm = ({ onClose, onSuccess }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState({ pickup: false, delivery: false });
  const [suggestions, setSuggestions] = useState({ pickup: [], delivery: [] });
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

  const LOCATIONIQ_API_KEY = 'pk.4ebcc4fec220d7040d681509bbb07232';

  const fetchCoordinates = async (address, locationType) => {
    setGeoLoading(prev => ({ ...prev, [locationType === 'pickupLocation' ? 'pickup' : 'delivery']: true }));
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(address)}&format=json`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setFormData(prev => ({
          ...prev,
          [locationType]: {
            ...prev[locationType],
            coordinates: { latitude: parseFloat(lat), longitude: parseFloat(lon) }
          }
        }));
      }
    } catch (error) {
      console.error(`Error fetching coordinates for ${locationType}:`, error);
    } finally {
      setGeoLoading(prev => ({ ...prev, [locationType === 'pickupLocation' ? 'pickup' : 'delivery']: false }));
    }
  };

  const fetchSuggestions = async (query, locationType) => {
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(query)}&format=json&limit=5`
      );
      const data = await response.json();
      setSuggestions(prev => ({
        ...prev,
        [locationType === 'pickupLocation' ? 'pickup' : 'delivery']: data
      }));
    } catch (error) {
      console.error(`Error fetching suggestions for ${locationType}:`, error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`Changing ${name} to ${value}`); // Debug log
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'cargo' && child === 'temperature') {
        setFormData(prev => ({
          ...prev,
          cargo: {
            ...prev.cargo,
            temperature: {
              ...prev.cargo.temperature,
              required: checked
            }
          }
        }));
      } else if (parent === 'pickupLocation' || parent === 'deliveryLocation') {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
        if (child === 'address' && value) {
          fetchSuggestions(value, parent);
          fetchCoordinates(value, parent);
        }
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSuggestionSelect = (suggestion, locationType) => {
    const [parent] = locationType.split('.');
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        address: suggestion.display_name,
        coordinates: { latitude: parseFloat(suggestion.lat), longitude: parseFloat(suggestion.lon) }
      }
    }));
    setSuggestions(prev => ({ ...prev, [parent === 'pickupLocation' ? 'pickup' : 'delivery']: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(data.booking);
        onClose();
      } else {
        alert(data.error || 'Failed to create booking');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#6A1B9A]">Create New Booking</h2>
            <button
              onClick={onClose}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                  onChange={handleChange}
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
              </div>
              <div>
                <input
                  type="text"
                  name="pickupLocation.contactPerson"
                  placeholder="Contact Person"
                  value={formData.pickupLocation.contactPerson}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                />
              </div>
              <div className="md:col-span-3">
                <input
                  type="tel"
                  name="pickupLocation.contactPhone"
                  placeholder="Contact Phone"
                  value={formData.pickupLocation.contactPhone}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
              </div>
              <div>
                <input
                  type="text"
                  name="deliveryLocation.contactPerson"
                  placeholder="Contact Person"
                  value={formData.deliveryLocation.contactPerson}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
                />
              </div>
              <div className="md:col-span-3">
                <input
                  type="tel"
                  name="deliveryLocation.contactPhone"
                  placeholder="Contact Phone"
                  value={formData.deliveryLocation.contactPhone}
                  onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                        temperature: {
                          ...prev.cargo.temperature,
                          min: e.target.value
                        }
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
                        temperature: {
                          ...prev.cargo.temperature,
                          max: e.target.value
                        }
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
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A1B9A]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#6A1B9A] text-white rounded-lg hover:bg-[#5A1A8A] disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;