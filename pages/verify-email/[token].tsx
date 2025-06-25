// pages/verify-email/[token].tsx
import API from '@/utils/api';
import { useRouter } from 'next/router';
import { useEffect } from 'react';


export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      API.get(`/verify-email/${token}/`).then(() => {
        alert('Email verified!');
        router.push('/login');
      }).catch(() => alert('Verification failed.'));
    }
  }, [token]);

  return <p>Verifying your email...</p>;
}
