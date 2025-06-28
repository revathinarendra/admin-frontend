//@ts-nocheck 
import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Grid,
  Stack, IconButton, Badge, Card, CardContent, Chip,
  Container, Divider, Fab, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem,
  Skeleton
} from '@mui/material';
import { useRouter } from 'next/router';
import API from '../../utils/api';
import { useNotification } from '@/src/context/NotificationContext';

// MUI Icons
import {
  Add as AddIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  LocalOffer as OfferIcon
} from '@mui/icons-material';
import Layout from '@/src/components/Layout';

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [cartQuantities, setCartQuantities] = useState<{ [key: number]: number }>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showSuccess, showError, showInfo } = useNotification();

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
      showError('Failed to fetch items');
    } finally {
      setLoading(false);
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
      showError('Failed to fetch cart items');
    }
  };

  const handleAddItem = async () => {
    if (!title.trim() || !description.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      const itemData = {
        title,
        description,
        price: price ? parseFloat(price) : 0,
        category: category || 'General'
      };
      
      const res = await API.post('/items/', itemData);
      setItems([...items, res.data]);
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setOpenDialog(false);
      showSuccess('Item added successfully');
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to add item');
    }
  };

  const handleAddOrUpdateToCart = async (itemId: number) => {
    const quantity = quantities[itemId] || 1;
    try {
      await API.post('/cart-items/', { item: itemId, quantity });
      setCartItems([...new Set([...cartItems, itemId])]);
      setCartQuantities({ ...cartQuantities, [itemId]: quantity });
      showSuccess('Cart updated successfully!');
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to update cart');
    }
  };

  const handleRemoveFromCart = async (itemId: number) => {
    try {
      await API.delete(`/cart-items/${itemId}/`);
      const updatedCart = cartItems.filter(id => id !== itemId);
      const { [itemId]: _, ...updatedQuantities } = cartQuantities;
      setCartItems(updatedCart);
      setCartQuantities(updatedQuantities);
      showInfo('Item removed from cart');
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to remove item');
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

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'General'];

  // Skeleton component for item cards
  const ItemCardSkeleton = () => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Skeleton variant="text" width="70%" height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
          
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Skeleton variant="rectangular" width={80} height={24} />
            <Skeleton variant="rectangular" width={60} height={24} />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="rectangular" width={70} height={40} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>

            <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Layout >
    <Box sx={{ 
      py: 4, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
      minHeight: '100vh' 
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" color="primary" mb={1}>
              <InventoryIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
              Inventory Management
      </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your products and track inventory
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Badge badgeContent={cartItems.length} color="error" showZero>
                <Button
                  variant="outlined"
                  onClick={handleViewCart}
                  startIcon={<ShoppingCartIcon />}
                sx={{ borderRadius: 2 }}
                >
                  View Cart
                </Button>
              </Badge>
            
            <Button
              variant="contained"
              onClick={() => setOpenDialog(true)}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                },
              }}
            >
              Add Item
            </Button>
          </Box>
        </Box>

        {/* Items Grid */}
        <Grid container spacing={3}>
          {loading ? (
            Array.from({ length: 8 }, (_, index) => (
              <ItemCardSkeleton key={index} />
            ))
          ) : items.length === 0 ? (
            <Grid item xs={12}>
              <Card sx={{ textAlign: 'center', py: 8 }}>
                <CardContent>
                  <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h5" color="text.secondary" mb={2}>
                    No items found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={3}>
                    Start by adding your first item to the inventory
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setOpenDialog(true)}
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      },
                    }}
                  >
                    Add First Item
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            items.map((item: any) => {
              const alreadyInCart = cartItems.includes(item.id);
              const quantity = quantities[item.id] || 1;

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card 
                  sx={{
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                    {item.title}
                  </Typography>
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40 }}>
                        {item.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Chip 
                          icon={<CategoryIcon />}
                          label={item.category || 'General'} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                        {item.price && (
                          <Chip 
                            icon={<MoneyIcon />}
                            label={`$${item.price}`} 
                            size="small" 
                            color="success" 
                            variant="outlined" 
                          />
                        )}
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                            size="small"
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

                          <IconButton 
                            size="small"
                            onClick={() => handleQuantityChange(item.id, quantity + 1)}
                          >
                      <AddCircleOutlineIcon />
                    </IconButton>
                        </Box>

                    <Button
                      variant="contained"
                          fullWidth
                      onClick={() => handleAddOrUpdateToCart(item.id)}
                      disabled={alreadyInCart && !hasQuantityChanged(item.id)}
                          sx={{ borderRadius: 2 }}
                    >
                      {alreadyInCart ? 'Update Cart' : 'Add to Cart'}
                    </Button>

                    {alreadyInCart && (
                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={() => handleRemoveFromCart(item.id)}
                            sx={{ borderRadius: 2 }}
                          >
                            Remove from Cart
                          </Button>
                    )}
                  </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>

        {/* Add Item Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Add New Item
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Item Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                required
              />
              
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                InputProps={{
                  startAdornment: <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddItem} 
              variant="contained"
              sx={{ 
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                },
              }}
            >
              Add Item
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
    </Layout>
  );
};

export default ItemsPage;
