import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Button,
  Grid,
  CardMedia,
} from "@mui/material";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`https://dummyjson.com/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading || !product) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box py={6} bgcolor="#fff">
      <Container>
        <Button variant="outlined" onClick={() => router.back()}>
          ← Back
        </Button>

        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={product.thumbnail}
              alt={product.title}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              ${product.price}
            </Typography>
            <Typography variant="body1" mt={2}>
              {product.description}
            </Typography>
            <Typography variant="body2" mt={2} color="text.secondary">
              Category: {product.category}
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 3 }}>
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
