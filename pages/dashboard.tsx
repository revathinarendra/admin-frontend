// // // pages/dashboard.tsx
// // import API from '@/utils/api';
// // import { useEffect, useState } from 'react';


// // import { Box, Typography, Paper, CircularProgress } from '@mui/material';


// // const Dashboard = () => {
// //   const [data, setData] = useState<any>(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     API.get('/dashboard/')
// //       .then(res => setData(res.data))
// //       .catch(console.error)
// //       .finally(() => setLoading(false));
// //   }, []);

// //   if (loading) return <CircularProgress sx={{ m: 5 }} />;

// //   return (
// //     <Box p={4}>
// //       <Typography variant="h4" gutterBottom>Dashboard</Typography>
// //       <Paper elevation={3} sx={{ p: 2 }}>
// //         <pre>{JSON.stringify(data, null, 2)}</pre>
// //       </Paper>
// //     </Box>
// //   );
// // };

// // export default Dashboard;
// // pages/dashboard.tsx
// import API from '@/utils/api';
// import { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   CircularProgress,
//   Grid,
//   Avatar,
//   Divider,
// } from '@mui/material';

// const Dashboard = () => {
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     API.get('/dashboard/')
//       .then(res => setData(res.data))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//   return (
//     <Box
//       display="flex"
//       alignItems="center"
//       justifyContent="center"
//       minHeight="100vh"
//     >
//       <CircularProgress />
//     </Box>
//   );
// }
//   if (!data) return <Typography variant="h6" p={4}>No data available</Typography>;

//   return (
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>
//         User Dashboard
//       </Typography>

//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Grid container spacing={4} alignItems="center">
//           <Grid item xs={12} sm={3}>
//             <Avatar
//               alt={data.full_name}
//               src={data.profile_picture}
//               sx={{ width: 120, height: 120, mx: 'auto' }}
//             />
//           </Grid>

//           <Grid item xs={12} sm={9}>
//             <Typography variant="h5" gutterBottom>
//               {data.full_name}
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//               Email: {data.email}
//             </Typography>
//             {data.google_email && (
//               <Typography variant="body2" color="text.secondary">
//                 Google Email: {data.google_email}
//               </Typography>
//             )}
//             <Typography variant="body1" color="text.secondary">
//               Phone: {data.phone_number}
//             </Typography>
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 3 }} />

//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="subtitle2" gutterBottom>Address</Typography>
//             <Typography variant="body2" color="text.secondary">
//               {data.address_line_1 || 'N/A'}
//               {data.address_line_2 && <>, {data.address_line_2}</>}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {data.city || ''} {data.state || ''} {data.country || ''}
//             </Typography>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <Typography variant="subtitle2" gutterBottom>Personal Info</Typography>
//             <Typography variant="body2" color="text.secondary">
//               Date of Birth: {data.date_of_birth || 'N/A'}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Gender: {data.gender || 'N/A'}
//             </Typography>
//           </Grid>
//         </Grid>
//       </Paper>
//     </Box>
//   );
// };

// export default Dashboard;
import { useEffect, useState } from 'react';
import API from '@/utils/api';
import Link from 'next/link';

import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const drawerWidth = 240;

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard/')
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography variant="h6">No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
    width: drawerWidth,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: {
      width: drawerWidth,
      boxSizing: 'border-box',
      bgcolor: 'darkgrey', // <-- Add this line
      color: 'white',       // Optional: better contrast for text/icons
    },
  }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <Link href="/dashboard" passHref legacyBehavior>
              <ListItem button component="a">
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </Link>

            <Link href="/items" passHref legacyBehavior>
              <ListItem button component="a">
                <ListItemIcon>
                  <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary="Items" />
              </ListItem>
            </Link>

            <Link href="/cart-items" passHref legacyBehavior>
              <ListItem button component="a">
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Add to Cart" />
              </ListItem>
            </Link>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Dashboard
        </Typography>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} sm={3}>
              <Avatar
                alt={data.full_name}
                src={data.profile_picture}
                sx={{ width: 120, height: 120, mx: 'auto' }}
              />
            </Grid>

            <Grid item xs={12} sm={9}>
              <Typography variant="h5" gutterBottom>
                {data.full_name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Email: {data.email}
              </Typography>
              {data.google_email && (
                <Typography variant="body2" color="text.secondary">
                  Google Email: {data.google_email}
                </Typography>
              )}
              <Typography variant="body1" color="text.secondary">
                Phone: {data.phone_number}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Address
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.address_line_1 || 'N/A'}
                {data.address_line_2 && <>, {data.address_line_2}</>}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.city || ''} {data.state || ''} {data.country || ''}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Personal Info
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date of Birth: {data.date_of_birth || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gender: {data.gender || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
