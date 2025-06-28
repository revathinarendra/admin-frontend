import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Stack,
  Chip,
  Avatar,
  Divider,
  Skeleton
} from "@mui/material";
import {
  Login as LoginIcon,
  ShoppingCart as CartIcon,
  Star as StarIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Speed as SpeedIcon,
  Verified as VerifiedIcon
} from "@mui/icons-material";
import Carousel from "react-material-ui-carousel";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  thumbnail: string;
}

export default function Home() {
  const carouselImages = [
    { src: "/static/images/one.webp", label: "Shop Now", title: "Discover Amazing Products" },
    { src: "/static/images/two.webp", label: "Shop Now", title: "Premium Quality Items" },
    { src: "/static/images/three.webp", label: "Shop Now", title: "Best Deals Today" },
    { src: "/static/images/web2.webp", label: "Shop Now", title: "Exclusive Collection" },
    { src: "/static/images/web.webp", label: "Shop Now", title: "Trending Now" },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        setProducts(data.products.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Secure Shopping",
      description: "Your data is protected with industry-standard encryption"
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: "Fast Delivery",
      description: "Get your orders delivered within 24-48 hours"
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40 }} />,
      title: "24/7 Support",
      description: "Our customer support team is always here to help"
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
      title: "Quality Guarantee",
      description: "All products are verified for quality and authenticity"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon 
        key={index} 
        sx={{ 
          fontSize: 16, 
          color: index < rating ? 'warning.main' : 'grey.300' 
        }} 
      />
    ));
  };

  // Skeleton component for product cards
  const ProductSkeleton = () => (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ height: "100%" }}>
        <Skeleton variant="rectangular" height={250} />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="rectangular" width={60} height={24} />
          </Box>
          
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Skeleton variant="rectangular" width={80} height={24} />
            <Skeleton variant="rectangular" width={60} height={24} />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton variant="text" width={60} height={32} />
            <Skeleton variant="text" width={80} height={20} />
          </Box>
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Skeleton variant="rectangular" width="100%" height={40} />
        </CardActions>
      </Card>
    </Grid>
  );

  // Skeleton component for feature cards
  const FeatureSkeleton = () => (
    <Grid item xs={12} sm={6} md={3}>
      <Card 
        sx={{ 
          height: '100%',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="80%" height={32} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="90%" height={20} />
      </Card>
    </Grid>
  );

  return (
    <Box>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", px: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'rgba(255, 255, 255, 0.2)',
                  mr: 2,
                }}
              >
                <CartIcon />
              </Avatar>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
                MyStore
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <Link href="/login" passHref>
                <Button
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                    borderRadius: 2,
                  }}
                >
                  Login
                </Button>
              </Link>
              <Link href="/register" passHref>
                <Button
                  variant="contained"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                    },
                    borderRadius: 2,
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', py: 6 }}>
        <Container maxWidth="xl">
          <Carousel
            indicators={true}
            navButtonsAlwaysVisible={true}
            animation="slide"
            autoPlay={true}
            interval={4000}
          >
            {carouselImages.map((item, i) => (
              <Box
                key={i}
                sx={{
                  height: { xs: "300px", sm: "400px", md: "500px" },
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Image
                  src={item.src}
                  alt={`carousel-${i}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
                    padding: 4,
                    color: 'white',
                  }}
                >
                  <Typography variant="h3" fontWeight="bold" mb={2}>
                    {item.title}
                  </Typography>
                  <Link href="/login">
                    <Button 
                      variant="contained" 
                      size="large"
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        },
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      {item.label}
                    </Button>
                  </Link>
                </Box>
              </Box>
            ))}
          </Carousel>
        </Container>
      </Box>

      <Box py={8} sx={{ background: 'white' }}>
        <Container maxWidth="xl">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight="bold" color="primary" mb={2}>
              Why Choose Us
            </Typography>
            <Typography variant="h6" color="text.secondary">
              We provide the best shopping experience with premium features
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box py={8} sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Container maxWidth="xl">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight="bold" color="primary" mb={2}>
              Featured Products
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Discover our handpicked collection of premium products
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {loading ? (
              // Show skeleton loaders while loading
              Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : (
              // Show actual products when loaded
              products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card 
                    sx={{ 
                      height: "100%",
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardMedia
                      component="img"
                      
                      image={product.thumbnail}
                      alt={product.title}
                      sx={{ objectFit: 'fill', height: "250px" }}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                          {product.title}
                        </Typography>
                        <Chip 
                          label={`${product.discountPercentage}% OFF`} 
                          color="error" 
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {product.description.slice(0, 80)}...
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        {renderStars(Math.floor(product.rating))}
                        <Typography variant="body2" color="text.secondary">
                          ({product.rating})
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          ${product.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          ${(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                    {/* <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button 
                        variant="contained" 
                        fullWidth
                        onClick={() => router.push(`/items/${product.id}`)}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                          },
                          borderRadius: 2,
                        }}
                      >
                        Add to Cart
                      </Button>
                    </CardActions> */}
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

      <Box 
        py={6} 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="xl">
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold" mb={2}>
              © 2025 MyStore. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
} 