// pages/_app.tsx
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import '@/styles/globals.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Navbar from '@/src/components/Navbar';
import { theme } from '@/src/theme/theme';
import { NotificationProvider } from '@/src/context/NotificationContext';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const token = Cookies.get('access_token');

    // List of routes where navbar should not appear
    const hiddenRoutes = ['/','/login', '/register', '/password-reset', '/verify-email', '/password-reset-confirm'];

    const shouldHideNavbar = hiddenRoutes.some(path => router.pathname.startsWith(path));

    setShowNavbar(!!token && !shouldHideNavbar);
  }, [router.pathname]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        {showNavbar && <Navbar />}
        <Component {...pageProps} />
      </NotificationProvider>
    </ThemeProvider>
  );
}
