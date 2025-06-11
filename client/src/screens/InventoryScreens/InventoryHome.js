import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import {
  Container, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Snackbar, Alert, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { Card as MuiCard, CardContent as MuiCardContent, IconButton as MuiIconButton } from '@mui/material';

import 'bootstrap/dist/css/bootstrap.min.css';
import AuthToken from '../../helper/AuthToken';


const initialFormState = { name: '', quantity: '', price: '', category: '' };

const StyledCard = styled(MuiCard)(({ theme }) => ({ // Changed from Card to MuiCard
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
  marginTop: 'auto',
});

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingProductId, setEditingProductId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const userName = AuthToken.getName();

  const API_BASE = 'http://localhost:8000/api/v1/product';
  const fetchProducts = async () => {
    try {

      const token = AuthToken.getToken();

      const res = await axios.get(`${API_BASE}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
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

      const token = AuthToken.getToken();

      if (editingProductId) {
        await axios.post(`${API_BASE}/edit/${editingProductId}`, data);
        setSnackbar({ open: true, message: 'Product updated!', severity: 'success' });
      } else {
        await axios.post(`${API_BASE}/add`, data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'  // optional but good practice
          }
        });
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
        fetchProducts();
      } catch (err) {
        console.error('Delete error:', err);
        setSnackbar({ open: true, message: 'Failed to delete product', severity: 'error' });
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <>
      <Navbar onLogout={handleLogout} name={userName} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>

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

        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="col-6 col-lg-3 mb-4"> {/* Added mb-4 for vertical spacing */}
                <StyledCard elevation={3}>
                  <MuiCardContent>
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
                  </MuiCardContent>
                  <ProductActions>
                    <MuiIconButton
                      aria-label="edit"
                      color="primary"
                      onClick={() => handleEdit(product)}
                    >
                      <EditIcon />
                    </MuiIconButton>
                    <MuiIconButton
                      aria-label="delete"
                      color="error"
                      onClick={() => handleDelete(product._id)}
                    >
                      <DeleteIcon />
                    </MuiIconButton>
                  </ProductActions>
                </StyledCard>
              </div>
            ))
          ) : (
            <div className="col-12">
              <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 5 }}>
                No products found. Add some to get started!
              </Typography>
            </div>
          )}
        </div>
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