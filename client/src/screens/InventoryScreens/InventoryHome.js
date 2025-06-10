import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import {
  Container, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Card, CardContent, IconButton,
  Snackbar, Alert, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

const initialFormState = { name: '', quantity: '', price: '', category: '' };

// Styled components for a more attractive UI
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const ProductActions = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 'auto', // Pushes actions to the bottom of the card
});

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingProductId, setEditingProductId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const API_BASE = 'http://localhost:4000/api/v1/product';

  // Load products from server
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_BASE);
      setProducts(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setSnackbar({ open: true, message: 'Failed to fetch products', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpen = () => {
    setFormData(initialFormState);
    setEditingProductId(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      };

      if (editingProductId) {
        // Edit product
        await axios.post(`${API_BASE}/edit/${editingProductId}`, data);
        setSnackbar({ open: true, message: 'Product updated!', severity: 'success' });
      } else {
        // Add product
        await axios.post(`${API_BASE}/add`, data);
        setSnackbar({ open: true, message: 'Product added!', severity: 'success' });
      }

      fetchProducts();
      handleClose();
    } catch (err) {
      console.error('Submit error:', err);
      setSnackbar({ open: true, message: 'Failed to submit product', severity: 'error' });
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingProductId(product._id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        console.log("This is in delete id : ", id);
        await axios.post(`${API_BASE}/delete/${id}`);
        console.log('Deleted successfully');
        setSnackbar({ open: true, message: 'Product deleted!', severity: 'info' });
        fetchProducts(); // Make sure this is called here
      } catch (err) {
        console.error('Delete error:', err);
        setSnackbar({ open: true, message: 'Failed to delete product', severity: 'error' });
      }
    }
  };

  const handleLogout = () => {
    // Clear localStorage or auth tokens here
    localStorage.clear();
    window.location.href = '/login'; // or redirect to your login route
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Product Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            size="large"
            sx={{ borderRadius: '20px' }}
          >
            Add Product
          </Button>
        </Box>

        <Grid container spacing={4}>
          {products.length > 0 ? (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <StyledCard elevation={3}>
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ mb: 1, color: 'text.primary' }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: <Typography component="span" sx={{ fontWeight: 'medium' }}>{product.quantity}</Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: <Typography component="span" sx={{ fontWeight: 'medium' }}>₹{product.price}</Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: <Typography component="span" sx={{ fontWeight: 'medium' }}>{product.category}</Typography>
                    </Typography>
                  </CardContent>
                  <ProductActions>
                    <IconButton
                      aria-label="edit"
                      color="primary"
                      onClick={() => handleEdit(product)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      color="error"
                      onClick={() => handleDelete(product._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ProductActions>
                </StyledCard>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 5 }}>
                No products found. Add some to get started!
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Dialog */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
            {editingProductId ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} color="primary">
              {editingProductId ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default ProductsPage;