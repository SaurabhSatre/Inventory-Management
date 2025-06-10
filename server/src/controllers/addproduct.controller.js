import Product from '../models/product.model.js';

// Add a new product
const addProduct = async (req, res) => {
  try {
    const { name, quantity, price, category } = req.body;

    // --- 1. Input Validation ---
    // Check if all required fields are provided
    if (!name || !quantity || !price || !category) {
      return res.status(400).json({ message: 'All product fields (name, quantity, price, category) are required.' });
    }

    // Validate 'name' and 'category'
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ message: 'Product name must be a non-empty string.' });
    }
    if (typeof category !== 'string' || category.trim().length === 0) {
      return res.status(400).json({ message: 'Product category must be a non-empty string.' });
    }

    // Validate 'quantity'
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive integer.' });
    }

    // Validate 'price'
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number.' });
    }

    // --- 2. Basic Sanitization (Optional but Recommended) ---
    // Trim whitespace from string inputs
    const sanitizedName = name.trim();
    const sanitizedCategory = category.trim();

    // You might also want to prevent potential XSS if these strings are rendered directly on a page
    // For example, using a library like 'sanitize-html' if you expect user-generated content.
    // However, for typical product data, basic trimming is often sufficient,
    // and frontend rendering should handle escaping.

    // --- 3. Create and Save Product ---
    const newProduct = new Product({
      name: sanitizedName,
      quantity: parsedQuantity, // Use the validated and parsed value
      price: parsedPrice,       // Use the validated and parsed value
      category: sanitizedCategory,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    console.error('Add product error:', error);
    // Handle database-specific errors or other unexpected server issues
    res.status(500).json({ message: 'Server error adding product. Please try again later.' });
  }
};

export default addProduct;