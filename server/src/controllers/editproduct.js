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

    // --- 2. Input Validation for Request Body Data ---
    // Check if at least one field to update is provided
    if (!name && !quantity && !price && !category) {
        return res.status(400).json({ message: 'At least one field (name, quantity, price, or category) is required for update.' });
    }

    const updateFields = {};

    // Validate and sanitize 'name' if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ message: 'Product name must be a non-empty string if provided.' });
      }
      updateFields.name = name.trim();
    }

    // Validate 'quantity' if provided
    if (quantity !== undefined) {
      const parsedQuantity = parseInt(quantity, 10);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive integer if provided.' });
      }
      updateFields.quantity = parsedQuantity;
    }

    // Validate 'price' if provided
    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({ message: 'Price must be a positive number if provided.' });
      }
      updateFields.price = parsedPrice;
    }

    // Validate and sanitize 'category' if provided
    if (category !== undefined) {
      if (typeof category !== 'string' || category.trim().length === 0) {
        return res.status(400).json({ message: 'Product category must be a non-empty string if provided.' });
      }
      updateFields.category = category.trim();
    }

    // --- 3. Attempt to Update Product ---
    // Using { new: true } to return the updated document
    // Using { runValidators: true } to run schema validators on the update
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateFields, // Use the validated and sanitized fields
      { new: true, runValidators: true }
    );

    // --- 4. Handle Update Result ---
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found with the provided ID.' });
    }

    // Product was successfully found and updated
    res.json(updatedProduct);

  } catch (error) {
    console.error('Edit product error:', error);
    // If a validation error from Mongoose occurs due to `runValidators: true`,
    // it will be caught here. You might want to parse error.name/error.code
    // for more specific 400 responses in production.
    res.status(500).json({ message: 'Server error updating product. Please try again later.' });
  }
};

export default editProduct;
