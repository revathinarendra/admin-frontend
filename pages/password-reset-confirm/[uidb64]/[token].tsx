// pages/password-reset-confirm/[uidb64]/[token].tsx
import API from '@/utils/api';
import { useRouter } from 'next/router';
import { useState } from 'react';


export default function ResetConfirm() {
  const router = useRouter();
  const { uidb64, token } = router.query;
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.post(`/password-reset-confirm/${uidb64}/${token}/`, { password });
    alert('Password reset successful!');
    router.push('/login');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" required />
      <button type="submit">Reset Password</button>
    </form>
  );
}
