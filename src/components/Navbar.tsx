// import React, { useEffect, useState } from 'react';
// import {
//   AppBar, Toolbar, Typography, IconButton, Button, Badge, Box
// } from '@mui/material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import { useRouter } from 'next/router';
// import API from '@/utils/api';


// const Navbar = () => {
//   const router = useRouter();
//   const [cartCount, setCartCount] = useState(0);

//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const res = await API.get('/cart-items/');
//         setCartCount(res.data.length);
//       } catch (err) {
//         console.error('Failed to fetch cart items');
//       }
//     };

//     fetchCart();
//   }, []);

//   const handleLogout = () => {
//     // Optional: Clear token from cookies if needed
//     router.push('/login');
//   };

//   return (
//     <AppBar position="static">
//       <Toolbar>
//         <Typography variant="h6" onClick={() => router.push('/')} sx={{ cursor: 'pointer', flexGrow: 1 }}>
//           Admin Dashboard
//         </Typography>

//         <Button color="inherit" onClick={() => router.push('/dashboard')}>Dashboard</Button>
//         <Button color="inherit" onClick={() => router.push('/items')}>Items</Button>
//         <IconButton color="inherit" onClick={() => router.push('/cart-items')}>
//           <Badge badgeContent={cartCount} color="error">
//             <ShoppingCartIcon />
//           </Badge>
//         </IconButton>

//         <Box ml={2}>
//           <Button color="inherit" onClick={handleLogout}>Logout</Button>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;
import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Button, Badge, Box, Avatar, Menu, MenuItem
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from 'next/router';
import API from '@/utils/api';


const Navbar = () => {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<{ email?: string, first_name?: string } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/me/');
        setUser(res.data);
      } catch (err) {
        console.error('User not logged in or failed to fetch /me/');
      }
    };

    const fetchCart = async () => {
      try {
        const res = await API.get('/cart-items/');
        setCartCount(res.data.length);
      } catch (err) {
        console.error('Failed to fetch cart items');
      }
    };

    fetchUser();
    fetchCart();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // or use Cookies.remove if stored there
    router.push('/login');
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" onClick={() => router.push('/')} sx={{ cursor: 'pointer', flexGrow: 1 }}>
          Admin Dashboard
        </Typography>

        <Button color="inherit" onClick={() => router.push('/dashboard')}>Dashboard</Button>
        <Button color="inherit" onClick={() => router.push('/items')}>Items</Button>

        <IconButton color="inherit" onClick={() => router.push('/cart-items')}>
          <Badge badgeContent={cartCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {/* Profile avatar */}
        {user && (
          <>
            <IconButton onClick={handleProfileClick} color="inherit">
              <Avatar alt={user?.first_name || user?.email} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem disabled>
                {user?.email}
              </MenuItem>
              <MenuItem onClick={() => { handleCloseMenu(); router.push('/profile/edit'); }}>
                Edit Profile
              </MenuItem>
              <MenuItem onClick={() => { handleCloseMenu(); router.push('/profile/change-password'); }}>
                Change Password
              </MenuItem>
              <MenuItem onClick={() => { handleCloseMenu(); handleLogout(); }}>
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
