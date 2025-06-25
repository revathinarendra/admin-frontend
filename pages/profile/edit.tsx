// // pages/profile/edit.tsx
// import API from '@/utils/api';
// import { useEffect, useState } from 'react';


// export default function EditProfile() {
//   const [profile, setProfile] = useState({ bio: '', location: '' });

//   useEffect(() => {
//     API.get('/userprofile/').then(res => setProfile(res.data)).catch(console.error);
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await API.put('/profile/edit/', profile);
//     alert('Profile updated.');
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="bio" value={profile.bio} onChange={handleChange} placeholder="Bio" />
//       <input name="location" value={profile.location} onChange={handleChange} placeholder="Location" />
//       <button type="submit">Save</button>
//     </form>
//   );
// }
// pages/profile/edit.tsx
import { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import API from '@/utils/api';


const EditProfile = () => {
  const [form, setForm] = useState({ first_name: '', last_name: '', phone_number: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    API.get('/userprofile/')
      .then(res => setForm(res.data))
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.patch('/profile/edit/', form);
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.response?.data?.error || 'Update failed.', severity: 'error' });
    }
  };

  return (
    <Box p={4}>
      <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }} component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" mb={2}>Edit Profile</Typography>
        <TextField label="First Name" name="first_name" value={form.first_name} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} fullWidth margin="normal" />
        <Button variant="contained" type="submit" sx={{ mt: 2 }} fullWidth>Update</Button>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity as any}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProfile;