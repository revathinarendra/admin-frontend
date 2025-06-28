import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Button, Badge, Box, Avatar, Menu, MenuItem,
  Container, Chip, Divider, Tooltip
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import API from '@/utils/api';
import { useNotification } from '@/src/context/NotificationContext';

const Navbar = () => {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<{ email?: string, first_name?: string } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { showError } = useNotification();

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
        showError('Failed to load cart items');
      }
    };

    fetchUser();
    fetchCart();
  }, [showError]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => router.push('/')}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                A
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white', 
                fontWeight: 700,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Admin Dashboard
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Tooltip title="Dashboard">
              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                onClick={() => router.push('/dashboard')}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Dashboard
              </Button>
            </Tooltip>
            
            <Tooltip title="Inventory">
              <Button
                color="inherit"
                startIcon={<InventoryIcon />}
                onClick={() => router.push('/items')}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Items
              </Button>
            </Tooltip>
          </Box>

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Search Icon */}
            <Tooltip title="Search">
              <IconButton color="inherit" sx={{ borderRadius: 2 }}>
                <SearchIcon />
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton color="inherit" sx={{ borderRadius: 2 }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Cart */}
            <Tooltip title="Shopping Cart">
              <IconButton 
                color="inherit" 
                onClick={() => router.push('/cart-items')}
                sx={{ borderRadius: 2 }}
              >
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile */}
            {user && (
              <>
                <Tooltip title="Profile">
                  <IconButton 
                    onClick={handleProfileClick} 
                    color="inherit"
                    sx={{ 
                      borderRadius: 2,
                      ml: 1,
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {getInitials(user.first_name, user.email)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {user?.email}
                    </Typography>
                    {user?.first_name && (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.first_name}
                      </Typography>
                    )}
                  </Box>
                  
                  <Divider />
                  
                  <MenuItem 
                    onClick={() => { handleCloseMenu(); router.push('/profile/edit'); }}
                    sx={{ py: 1.5 }}
                  >
                    <AccountCircleIcon sx={{ mr: 2, fontSize: 20 }} />
                    Edit Profile
                  </MenuItem>
                  
                  <MenuItem 
                    onClick={() => { handleCloseMenu(); router.push('/profile/change-password'); }}
                    sx={{ py: 1.5 }}
                  >
                    <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
                    Change Password
                  </MenuItem>
                  
                  <Divider />
                  
                  <MenuItem 
                    onClick={() => { handleCloseMenu(); handleLogout(); }}
                    sx={{ py: 1.5, color: 'error.main' }}
                  >
                    <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
