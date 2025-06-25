//@ts-nocheck 
import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Grid,
  Snackbar, Alert, Stack, IconButton, Badge
} from '@mui/material';
import { useRouter } from 'next/router';
import API from '../../utils/api';

// MUI Icons
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from '@/src/components/Layout';

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [cartQuantities, setCartQuantities] = useState<{ [key: number]: number }>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const router = useRouter();

  useEffect(() => {
    fetchItems();
    fetchCartItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get('/items/');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCartItems = async () => {
    try {
      const res = await API.get('/cart-items/');
      const cartItemIds = res.data.map((item: any) => item.item);
      const quantitiesMap: { [key: number]: number } = {};
      res.data.forEach((item: any) => {
        quantitiesMap[item.item] = item.quantity;
      });
      setCartItems(cartItemIds);
      setCartQuantities(quantitiesMap);
      setQuantities(quantitiesMap);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async () => {
    try {
      const res = await API.post('/items/', { title, description });
      setItems([...items, res.data]);
      setTitle('');
      setDescription('');
      setSnackbar({ open: true, message: 'Item added successfully', severity: 'success' });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Failed to add item',
        severity: 'error',
      });
    }
  };

  const handleAddOrUpdateToCart = async (itemId: number) => {
    const quantity = quantities[itemId] || 1;
    try {
      await API.post('/cart-items/', { item: itemId, quantity });
      setCartItems([...new Set([...cartItems, itemId])]);
      setCartQuantities({ ...cartQuantities, [itemId]: quantity });
      setSnackbar({ open: true, message: 'Cart updated!', severity: 'success' });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Failed to update cart',
        severity: 'error',
      });
    }
  };

  const handleRemoveFromCart = async (itemId: number) => {
    try {
      await API.delete(`/cart-items/${itemId}/`);
      const updatedCart = cartItems.filter(id => id !== itemId);
      const { [itemId]: _, ...updatedQuantities } = cartQuantities;
      setCartItems(updatedCart);
      setCartQuantities(updatedQuantities);
      setSnackbar({ open: true, message: 'Item removed from cart.', severity: 'info' });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Failed to remove item',
        severity: 'error',
      });
    }
  };

  const handleQuantityChange = (itemId: number, newValue: number) => {
    setQuantities({
      ...quantities,
      [itemId]: Math.max(1, newValue),
    });
  };

  const hasQuantityChanged = (itemId: number) =>
    quantities[itemId] !== cartQuantities[itemId];

  const handleViewCart = () => {
    router.push('/cart-items');
  };

  return (
    <Layout >
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        <AddIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Items
      </Typography>
      <Grid container spacing={2}>
        {/* Add Item Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">
              <AddIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Add Item
            </Typography>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              margin="normal"
              multiline
            />
            <Button variant="contained" onClick={handleAddItem} sx={{ mt: 2 }}>
              Add Item
            </Button>
          </Paper>
        </Grid>

        {/* Items Display */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                <InventoryIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Your Items
              </Typography>
              <Badge badgeContent={cartItems.length} color="primary" showZero>
                <Button
                  variant="outlined"
                  onClick={handleViewCart}
                  startIcon={<ShoppingCartIcon />}
                >
                  View Cart
                </Button>
              </Badge>
            </Stack>

            {items.map((item: any) => {
              const alreadyInCart = cartItems.includes(item.id);
              const quantity = quantities[item.id] || 1;

              return (
                <Box
                  key={item.id}
                  mt={3}
                  p={2}
                  borderRadius={2}
                  sx={{
                    backgroundColor: '#f8f9fa',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography fontWeight="bold" fontSize="1.1rem">
                    {item.title}
                  </Typography>
                  <Typography mb={1}>{item.description}</Typography>

                  <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                    <IconButton
                      onClick={() => handleQuantityChange(item.id, quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>

                    <TextField
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                      }
                      sx={{ width: 70 }}
                      size="small"
                      inputProps={{ min: 1 }}
                    />

                    <IconButton onClick={() => handleQuantityChange(item.id, quantity + 1)}>
                      <AddCircleOutlineIcon />
                    </IconButton>

                    <Button
                      variant="contained"
                      onClick={() => handleAddOrUpdateToCart(item.id)}
                      disabled={alreadyInCart && !hasQuantityChanged(item.id)}
                    >
                      {alreadyInCart ? 'Update Cart' : 'Add to Cart'}
                    </Button>

                    {alreadyInCart && (
                      <IconButton color="error" onClick={() => handleRemoveFromCart(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Box>
              );
            })}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as any} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
    </Layout>
  );
};

export default ItemsPage;
