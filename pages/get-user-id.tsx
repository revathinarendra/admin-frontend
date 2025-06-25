// pages/get-user-id.tsx
import API from '@/utils/api';
import { useEffect, useState } from 'react';


export default function GetUserId() {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    API.get('/get-user-id/').then(res => setUserId(res.data.id)).catch(console.error);
  }, []);

  return <p>User ID: {userId}</p>;
}
