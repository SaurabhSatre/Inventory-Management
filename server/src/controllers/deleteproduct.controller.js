import Product from '../models/product.model.js';

// Add a new product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // --- 1. Input Validation for 'id' ---
    // Check if 'id' is provided
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required for deletion.' });
    }

    // Validate 'id' format (assuming MongoDB ObjectId format)
    // A common ObjectId string length is 24 hexadecimal characters.
    // This is a basic check; for more rigorous validation, you might use a library
    // like 'mongoose.Types.ObjectId.isValid()' if you have access to Mongoose types,
    // or a regex for a more strict format check.
    if (typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]+$/.test(id)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    // --- 2. Attempt to Delete Product ---
    const deletedProduct = await Product.findByIdAndDelete(id);

    // --- 3. Handle Deletion Result ---
    if (!deletedProduct) {
      // If deletedProduct is null, it means no document with that ID was found
      return res.status(404).json({ message: 'Product not found with the provided ID.' });
    }

    // Product was successfully found and deleted
    res.json({ message: 'Product deleted successfully.' });

  } catch (error) {
    console.error('Delete product error:', error);
    // It's good practice to differentiate between client-side errors (4xx)
    // and server-side errors (5xx). If the error indicates a problem
    // with the ID format (e.g., Mongoose casting error for invalid ObjectId),
    // it could be a 400. Otherwise, it's a server error.
    // For simplicity, keeping it 500 for unexpected errors from the DB layer.
    res.status(500).json({ message: 'Server error deleting product. Please try again later.' });
  }
};

export default deleteProduct;