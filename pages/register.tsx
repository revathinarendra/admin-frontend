// pages/register.tsx
import { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper,
  Snackbar, Alert, Stack, Grid, Link
} from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setSnackbar({ open: true, message: "Passwords don't match", severity: 'error' });
      return;
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register/`, form);
      setSnackbar({ open: true, message: 'Registration successful. Please check your email to verify.', severity: 'success' });
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.response?.data?.error || 'Registration failed.', severity: 'error' });
    }
  };

  return (
    <Box>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            component="form"
            onSubmit={handleSubmit}
            sx={{ p: 4, mt: 8, mx: 'auto', maxWidth: 500 }}
          >
            <Typography variant="h5" mb={2}>Create Account</Typography>

            <TextField fullWidth label="First Name" name="first_name" value={form.first_name} onChange={handleChange} margin="normal" required />
            <TextField fullWidth label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} margin="normal" required />
            <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} margin="normal" type="email" required />
            <TextField fullWidth label="Password" name="password" value={form.password} onChange={handleChange} margin="normal" type="password" required />
            <TextField fullWidth label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} margin="normal" type="password" required />

            <Button variant="contained" type="submit" sx={{ mt: 2 }} fullWidth>Register</Button>

            <Stack mt={2} direction="row" justifyContent="center">
              <Link href="/login" underline="hover">Already have an account? Login</Link>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity as any}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
