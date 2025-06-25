// pages/delete-user.tsx

import API from '@/utils/api';
import { useRouter } from 'next/router';

export default function DeleteUser() {
  const router = useRouter();

  const handleDelete = async () => {
    await API.delete('/delete-user/');
    alert('User deleted');
    router.push('/register');
  };

  return <button onClick={handleDelete}>Delete Account</button>;
}
