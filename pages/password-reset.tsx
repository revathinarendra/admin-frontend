// pages/password-reset.tsx
import API from '@/utils/api';
import { useState } from 'react';


export default function PasswordReset() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.post('/password-reset/', { email });
    alert('Reset email sent.');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
      <button type="submit">Send Reset Link</button>
    </form>
  );
}
