// components/LoginForm.tsx
import { useState } from 'react';

import { useRouter } from 'next/router';
import API from '@/utils/api';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/login/', { email, password });
      alert('Login successful');
      router.push('/dashboard');
    } catch (error: any) {
      alert('Login failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}
