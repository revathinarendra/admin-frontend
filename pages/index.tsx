 //@ts-nocheck 
import React, { useEffect, useState } from "react";
import LoginIcon from '@mui/icons-material/Login';

import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const carouselImages = [
    { src: "/static/images/one.webp", label: "Shop Now" },
    { src: "/static/images/two.webp", label: "Shop Now" },
    { src: "/static/images/three.webp", label: "Shop Now" },
    { src: "/static/images/web2.webp", label: "Shop Now" },
    { src: "/static/images/web.webp", label: "Shop Now" },
  ];

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products.slice(0, 6))); // top 6
  }, []);

  return (
    <Box>
      {/* Navbar */}
      {/* <AppBar position="static" color="primary" enableColorOnDark> */}
      <AppBar
  position="static"
  enableColorOnDark
  sx={{
    backgroundColor: '#673ab7', // deep purple
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  }}
>

        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">MyStore</Typography>
          <Box>
            <Link href="/login" passHref>
              {/* <Button color="white" sx={{ mr: 2 }}>
               Login
                
              </Button> */}
              <Button
  sx={{
    mr: 2,
    bgcolor: "#fff",
    color: "#000",
    '&:hover': {
      bgcolor: "#f0f0f0",
    },
  }}
  variant="contained"
>
  Login
</Button>

              

            </Link>
            <Link href="/register" passHref>
              {/* <Button variant="outlined" color="inherit">
                Signup
              </Button> */}
              <Button
  sx={{
    mr: 2,
    bgcolor: "#fff",
    color: "#000",
    '&:hover': {
      bgcolor: "#f0f0f0",
    },
  }}
  variant="contained"
>
  Signup
</Button>

            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Carousel */}
      <Box py={6} bgcolor="#fff">
        <Container>
          <Carousel
            indicators={true}
            navButtonsAlwaysVisible={true}
            animation="slide"
            autoPlay={true}
            interval={3000}
          >
            {carouselImages.map((item, i) => (
              <Box
                key={i}
                sx={{
                  height: { xs: "180px", sm: "300px", md: "400px" }
,
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
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
                    bottom: 20,
                    left: 20,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: 2,
                    borderRadius: 1,
                  }}
                >
                  <Link href="/products">
                    <Button variant="contained" color="warning">
                      {item.label}
                    </Button>
                  </Link>
                </Box>
              </Box>
            ))}
          </Carousel>
        </Container>
      </Box>

      {/* Product Grid */}
      <Box py={8} bgcolor="#f9f9f9">
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            Featured Products
          </Typography>
          <Grid container spacing={4} mt={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ height: "100%" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.thumbnail}
                    alt={product.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description.slice(0, 60)}...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      ${product.price}
                    </Button>
                    <Button size="small" variant="outlined" href="/products">
                      View
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      

      {/* Footer */}
      
      <Box py={4} textAlign="center" bgcolor="#6a1b9a" color="#ffffff">
  <Typography variant="body2">© 2025 MyStore. All rights reserved.</Typography>
</Box>

    </Box>
  );
}
