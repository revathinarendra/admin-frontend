// // // pages/login.tsx

// import LoginForm from "@/src/components/LoginForm";


// export default function LoginPage() {
//   return <LoginForm />;
// }
import * as React from 'react';
import {
  Box, Grid, Stack, Typography, Paper, TextField,
  Button, FormControl, OutlinedInput, InputAdornment,
  IconButton, Snackbar, Alert, Chip, Link
} from '@mui/material';
import { Visibility, VisibilityOff, Google } from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [waiting, setWaiting] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const router = useRouter();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event: React.MouseEvent) => event.preventDefault();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setSnackbarMessage('Please fill in all fields.');
      setOpenSnackbar(true);
    } else if (!validateEmail(email)) {
      setSnackbarMessage('Please enter a valid email address.');
      setOpenSnackbar(true);
    } else {
      setWaiting(true);
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login/`, {
          email,
          password,
        });

        if (res.status === 200) {
          Cookies.set('access_token', res.data.access, { expires: 7 });
          setSnackbarMessage('Login successful!');
          setOpenSnackbar(true);
          setTimeout(() => router.push('/dashboard'), 2000);
        }
      } catch (err: any) {
        setSnackbarMessage(err.response?.data?.error || 'Invalid credentials!');
        setOpenSnackbar(true);
      } finally {
        setWaiting(false);
      }
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/accounts/google/login/`;
  };

  return (
    <Box>
      <Grid container alignItems="center">
        <Grid item md={6} sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Stack direction="row" alignItems="center" justifyContent="center" ml={6}>
            <img src="/static/images/logo.jpg" alt="logo" width={200} height={200} />
            <Typography fontSize={35} fontWeight="bold">WEBSITE</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: { md: '10%', xs: '0' },
              mb: { md: '10%', xs: '25%' },
              p: 3,
              mx: { xs: '5%', md: '20%' },
              width: 450,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography fontSize={{ md: 20, xs: 25 }} fontWeight="bold" my={3}>Login</Typography>

            <FormControl sx={{ m: 1, width: '80%' }} variant="outlined">
              <TextField
                autoFocus
                required
                placeholder="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!validateEmail(email) && email.length > 0}
                helperText={!validateEmail(email) && email.length > 0 ? "Invalid email format" : ""}
              />
            </FormControl>

            <FormControl sx={{ m: 1, width: '80%' }} required variant="outlined">
              <OutlinedInput
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Button variant="contained" type="submit" sx={{ my: 3 }} disabled={waiting}>
              {waiting ? 'Logging in...' : 'Login'}
            </Button>

            <Stack direction={{ md: 'row', xs: 'column' }} justifyContent="space-between" spacing={2}>
              <Link href="/register" fontSize={16} underline="hover">Create New Account</Link>
              <Link href="/password-reset" fontSize={16} underline="hover">Forgot password?</Link>
            </Stack>

            <Stack mt={3}>
              <Button onClick={handleGoogleLogin}>
                <Chip variant="filled" label="Login with Google" icon={<Google style={{ color: 'white' }} />} color="error" />
              </Button>
            </Stack>
          </Paper>

          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={snackbarMessage === 'Login successful!' ? 'success' : 'error'} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
