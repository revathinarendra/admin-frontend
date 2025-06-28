// // // pages/login.tsx

// import LoginForm from "@/src/components/LoginForm";


// export default function LoginPage() {
//   return <LoginForm />;
// }
import * as React from 'react';
import {
  Box, Grid, Stack, Typography, Paper, TextField,
  Button, FormControl, OutlinedInput, InputAdornment,
  IconButton, Chip, Link, Container, Divider
} from '@mui/material';
import { 
  Visibility, VisibilityOff, Google, Email, Lock,
  Login as LoginIcon, ArrowForward
} from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useNotification } from '@/src/context/NotificationContext';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [waiting, setWaiting] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});

  const router = useRouter();
  const { showSuccess, showError } = useNotification();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event: React.MouseEvent) => event.preventDefault();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setWaiting(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login/`, {
        email,
        password,
      });

      if (res.status === 200) {
        Cookies.set('access_token', res.data.access, { expires: 7 });
        showSuccess('Login successful! Redirecting to dashboard...');
        setTimeout(() => router.push('/dashboard'), 1500);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Invalid credentials. Please try again.';
      showError(errorMessage);
    } finally {
      setWaiting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/accounts/google/login/`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container alignItems="center" justifyContent="center">
          {/* Left Side - Brand */}
          <Grid item md={6} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Box
              sx={{
                textAlign: 'center',
                color: 'white',
                p: 4,
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <img 
                  src="/static/images/logo.jpg" 
                  alt="logo" 
                  style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: 8,
                    objectFit: 'cover'
                  }} 
                />
              </Box>
              <Typography variant="h3" fontWeight="bold" mb={2}>
                Welcome Back
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                Sign in to your account to continue
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Chip 
                  label="Secure Login" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ color: 'white', borderColor: 'white' }}
                />
                <Chip 
                  label="24/7 Support" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ color: 'white', borderColor: 'white' }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={24}
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 4,
                mx: { xs: 2, md: 0 },
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="primary" mb={1}>
                  Sign In
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Enter your credentials to access your account
                </Typography>
              </Box>

              <Stack spacing={3}>
                <FormControl fullWidth>
                  <TextField
                    autoFocus
                    required
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    required
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </FormControl>

                <Button
                  variant="contained"
                  type="submit"
                  disabled={waiting}
                  size="large"
                  endIcon={waiting ? null : <ArrowForward />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    },
                  }}
                >
                  {waiting ? 'Signing In...' : 'Sign In'}
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>

                <Button
                  variant="outlined"
                  onClick={handleGoogleLogin}
                  startIcon={<Google />}
                  size="large"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: '#db4437',
                    color: '#db4437',
                    '&:hover': {
                      borderColor: '#c23321',
                      backgroundColor: 'rgba(219, 68, 55, 0.04)',
                    },
                  }}
                >
                  Continue with Google
                </Button>

                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  justifyContent="space-between" 
                  alignItems="center"
                  spacing={2}
                  sx={{ mt: 2 }}
                >
                  <Link 
                    href="/register" 
                    variant="body2" 
                    underline="hover"
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 500,
                      '&:hover': {
                        color: 'primary.dark',
                      }
                    }}
                  >
                    Don&apos;t have an account? Sign up
                  </Link>
                  <Link 
                    href="/password-reset" 
                    variant="body2" 
                    underline="hover"
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 500,
                      '&:hover': {
                        color: 'primary.dark',
                      }
                    }}
                  >
                    Forgot password?
                  </Link>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
