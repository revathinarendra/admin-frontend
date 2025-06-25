// pages/profile/change-password.tsx
import API from '@/utils/api';
import { useState } from 'react';


export default function ChangePassword() {
  const [current_password, setCurrentPassword] = useState('');
  const [new_password, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.put('/profile/change-password/', { current_password, new_password });
    alert('Password changed.');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="password" value={current_password} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" required />
      <input type="password" value={new_password} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" required />
      <button type="submit">Change Password</button>
    </form>
  );
}
