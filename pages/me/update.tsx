// pages/me/update.tsx
import API from '@/utils/api';
import { useState, useEffect } from 'react';


export default function UpdateUser() {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', phone_number: '' });

  useEffect(() => {
    API.get('/me/').then((res) => setFormData(res.data)).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.put('/me/update/', formData);
    alert('Profile updated!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required />
      <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required />
      <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" required />
      <button type="submit">Update</button>
    </form>
  );
}