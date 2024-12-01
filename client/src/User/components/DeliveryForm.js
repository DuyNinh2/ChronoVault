import React, { useState, useEffect } from 'react';
import '../styles/DeliveryForm.scss';
import { fetchUserData } from '../services/userService'; 
import vietnamCities from '../services/vietnamCities';

const DeliveryForm = () => {
  const [userData, setUserData] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data
    fetchUserData()
      .then((data) => {
        setUserData(data);
        setSelectedCity(data.address[0]?.city || ''); // Set selected city from user data
        setSelectedDistrict(data.address[0]?.district || ''); // Set selected district from user data
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Update districts when selectedCity changes
    const cityData = vietnamCities.find((city) => city.name === selectedCity);
    setDistricts(cityData ? cityData.districts : []);
    if (!cityData) setSelectedDistrict(''); // Reset district if city is invalid
  }, [selectedCity]);

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>Error loading user data.</p>;

  return (
    <div className="delivery">
      <h2>Delivery</h2>
      <form className="delivery-form">
        <p>Enter your name and address:</p>

        <input type="text" placeholder="Name" defaultValue={userData.username} readOnly />
        <input type="text" placeholder="Address" defaultValue={userData.address[0]?.street || ''} />

        <div className="dropdowns">
          <select
            value={selectedCity} // Bind selectedCity to the City dropdown
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="" disabled>
              Select City
            </option>
            {vietnamCities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          <select
            value={selectedDistrict} // Bind selectedDistrict to the District dropdown
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="" disabled>
              Select District
            </option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <h3>What's your contact information?</h3>
        <input type="email" placeholder="Email" defaultValue={userData.email} readOnly />
        <p className="note">A confirmation email will be sent after checkout.</p>
        <input type="tel" placeholder="Phone Number" defaultValue={userData.phone} readOnly />
        <p className="note">A carrier might contact you to confirm delivery.</p>
      </form>
    </div>
  );
};

export default DeliveryForm;
