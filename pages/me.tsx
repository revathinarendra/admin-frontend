// pages/me.tsx
import API from '@/utils/api';
import { useEffect, useState } from 'react';


export default function Me() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    API.get('/me/').then((res) => setUser(res.data)).catch(console.error);
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {user.first_name}</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone_number}</p>
    </div>
  );
}
