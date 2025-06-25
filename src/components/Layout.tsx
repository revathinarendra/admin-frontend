// components/Layout.tsx
import { ReactNode, useEffect, useState } from 'react';
import Navbar from './Navbar';
import Cookies from 'js-cookie';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('access_token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      {isAuthenticated && <Navbar />}
      {children}
    </>
  );
}
