import React, { useEffect, useState } from 'react';
import {
  Box, Container, Grid, Card, CardContent, Typography, 
  IconButton, Button, Chip, LinearProgress, Stack, Divider, Paper,
  Skeleton
} from '@mui/material';
import {
  TrendingUp, TrendingDown, ShoppingCart, Inventory,
  People, AttachMoney, MoreVert, Add, Visibility,
  Edit, Delete, Star
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import API from '@/utils/api';
import { useNotification } from '@/src/context/NotificationContext';

const Dashboard = () => {
  const router = useRouter();
  const { showError } = useNotification();
  const [stats, setStats] = useState({
    totalItems: 0,
    totalUsers: 150,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const itemsRes = await API.get('/items/');
        const cartRes = await API.get('/cart-items/');
        
        const totalRevenue = cartRes.data.reduce((sum: number, item: any) => sum + (item.price || 0), 0);
        
        setStats({
          totalItems: itemsRes.data.length,
          totalUsers: 150,
          totalOrders: cartRes.data.length,
          totalRevenue: totalRevenue,
        });
        
        const recent = itemsRes.data.slice(0, 5).map((item: any) => ({
          id: item.id,
          name: item.title || 'Unnamed Item',
          price: item.price || 0,
          category: item.category || 'General',
          stock: item.stock || 0,
          rating: Math.floor(Math.random() * 5) + 1,
        }));
        
        setRecentItems(recent);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        showError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showError]);

  const StatCard = ({ title, value, icon, color, trend, trendValue }: any) => (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${color}20`,
        },
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {icon}
          </Box>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
        
        <Typography variant="h4" fontWeight="bold" mb={1}>
          {value}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" mb={2}>
          {title}
        </Typography>
        
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {trend === 'up' ? (
              <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
            ) : (
              <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
            )}
            <Typography 
              variant="caption" 
              color={trend === 'up' ? 'success.main' : 'error.main'}
              fontWeight={600}
            >
              {trendValue}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const StatCardSkeleton = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 2 }} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
        
        <Skeleton variant="text" width="60%" height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="40%" height={20} />
      </CardContent>
    </Card>
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        sx={{ 
          fontSize: 16, 
          color: index < rating ? 'warning.main' : 'grey.300' 
        }} 
      />
    ));
  };

  const RecentItemSkeleton = () => (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Skeleton variant="rectangular" width={80} height={24} />
            <Skeleton variant="text" width={60} height={20} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="rectangular" width={80} height={16} />
            <Skeleton variant="text" width={40} height={16} />
          </Box>
        </Box>
        
        <Box sx={{ textAlign: 'right', mr: 2 }}>
          <Skeleton variant="text" width={60} height={32} />
        </Box>
        
        <Stack direction="row" spacing={1}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Stack>
      </Box>
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ py: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
        <Container maxWidth="xl">
          {/* Header Skeleton */}
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="text" width="40%" height={48} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={24} />
          </Box>

          {/* Stats Cards Skeleton */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatCardSkeleton />
              </Grid>
            ))}
          </Grid>

          {/* Content Skeleton */}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Skeleton variant="text" width="30%" height={40} />
                    <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
      </Box>
                  
                  <Stack spacing={2}>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <RecentItemSkeleton key={index} />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Skeleton variant="text" width="50%" height={40} sx={{ mb: 3 }} />
                  
                  <Stack spacing={2}>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} variant="rectangular" width="100%" height={48} sx={{ borderRadius: 2 }} />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" color="primary" mb={1}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here&apos;s what&apos;s happening with your store today.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Items"
              value={stats.totalItems}
              icon={<Inventory />}
              color="#6366f1"
              trend="up"
              trendValue="+12%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<People />}
              color="#10b981"
              trend="up"
              trendValue="+8%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<ShoppingCart />}
              color="#f59e0b"
              trend="down"
              trendValue="-3%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toFixed(2)}`}
              icon={<AttachMoney />}
              color="#ef4444"
              trend="up"
              trendValue="+15%"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Recent Items
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => router.push('/items')}
        sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    },
  }}
      >
                    Add Item
                  </Button>
                </Box>

                {recentItems.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No items found. Add your first item to get started!
                    </Typography>
        </Box>
                ) : (
                  <Stack spacing={2}>
                    {recentItems.map((item: any) => (
                      <Paper
                        key={item.id}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="600" mb={1}>
                              {item.name}
        </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Chip 
                                label={item.category} 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                              />
                              <Typography variant="body2" color="text.secondary">
                                Stock: {item.stock}
              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {renderStars(item.rating)}
                              <Typography variant="body2" color="text.secondary">
                                ({item.rating}/5)
              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ textAlign: 'right', mr: 2 }}>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                              ${item.price}
                </Typography>
                          </Box>
                          
                          <Stack direction="row" spacing={1}>
                            <IconButton size="small" color="primary">
                              <Visibility />
                            </IconButton>
                            <IconButton size="small" color="primary">
                              <Edit />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Delete />
                            </IconButton>
                          </Stack>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                  Quick Actions
                </Typography>
                
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Add />}
                    onClick={() => router.push('/items')}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Add New Item
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={() => router.push('/cart-items')}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    View Cart Items
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<People />}
                    onClick={() => router.push('/get-user-id')}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Manage Users
                  </Button>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box>
                    <Typography variant="h6" fontWeight="600" mb={2}>
                      System Status
              </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Database</Typography>
                        <Chip label="Online" color="success" size="small" />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">API</Typography>
                        <Chip label="Online" color="success" size="small" />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Storage</Typography>
                        <Chip label="Online" color="success" size="small" />
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;