import Product from '../models/product.model.js';

const addProduct = async (req, res) => {
  try {
    const { name, quantity, price, category } = req.body;

    if (!name || !quantity || !price || !category) {
      return res.status(400).json({ message: 'All product fields (name, quantity, price, category) are required.' });
    }

    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ message: 'Product name must be a non-empty string.' });
    }
    if (typeof category !== 'string' || category.trim().length === 0) {
      return res.status(400).json({ message: 'Product category must be a non-empty string.' });
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive integer.' });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number.' });
    }

    const sanitizedName = name.trim();
    const sanitizedCategory = category.trim();

    const newProduct = new Product({
      name: sanitizedName,
      quantity: parsedQuantity, 
      price: parsedPrice,       
      category: sanitizedCategory,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: 'Server error adding product. Please try again later.' });
  }
};

export default addProduct;