import Product from '../models/product.model.js';

// Edit an existing product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, price, category } = req.body;

    // --- 1. Input Validation for 'id' ---
    // Check if 'id' is provided
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required for editing.' });
    }

    // Validate 'id' format (assuming MongoDB ObjectId format)
    if (typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]+$/.test(id)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    if (!name && !quantity && !price && !category) {
        return res.status(400).json({ message: 'At least one field (name, quantity, price, or category) is required for update.' });
    }

    const updateFields = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ message: 'Product name must be a non-empty string if provided.' });
      }
      updateFields.name = name.trim();
    }

    if (quantity !== undefined) {
      const parsedQuantity = parseInt(quantity, 10);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive integer if provided.' });
      }
      updateFields.quantity = parsedQuantity;
    }

    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({ message: 'Price must be a positive number if provided.' });
      }
      updateFields.price = parsedPrice;
    }
    if (category !== undefined) {
      if (typeof category !== 'string' || category.trim().length === 0) {
        return res.status(400).json({ message: 'Product category must be a non-empty string if provided.' });
      }
      updateFields.category = category.trim();
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found with the provided ID.' });
    }

    res.json(updatedProduct);

  } catch (error) {
    console.error('Edit product error:', error);
    res.status(500).json({ message: 'Server error updating product. Please try again later.' });
  }
};

export default editProduct;
