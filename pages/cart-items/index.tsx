// pages/cart-items/index.tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Snackbar, Alert } from '@mui/material';

import Layout from '@/src/components/Layout';
import API from '@/utils/api';

const CartItemsPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    API.get('/cart-items/')
      .then(res => setCartItems(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddCartItem = async () => {
    try {
      const res = await API.post('/cart-items/', { item: itemId, quantity });
      setCartItems([...cartItems, res.data]);
      setItemId('');
      setQuantity(1);
      setSnackbar({ open: true, message: 'Cart item added!', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.response?.data?.error || 'Add failed.', severity: 'error' });
    }
  };

  return (
    <Layout >
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Cart Items</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Add to Cart</Typography>
            <TextField fullWidth label="Item ID" value={itemId} onChange={e => setItemId(e.target.value)} margin="normal" />
            <TextField fullWidth label="Quantity" type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} margin="normal" />
            <Button variant="contained" onClick={handleAddCartItem}>Add</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Your Cart</Typography>
            {cartItems.map((ci: any) => (
              <Box key={ci.id} mb={2}>
                <Typography>Item ID: {ci.item}</Typography>
                <Typography>Quantity: {ci.quantity}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity as any}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
    </Layout>
  );
};

export default CartItemsPage;
