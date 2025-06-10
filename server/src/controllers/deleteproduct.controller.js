import Product from '../models/product.model.js';

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;


    if (!id) {
      return res.status(400).json({ message: 'Product ID is required for deletion.' });
    }

    if (typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]+$/.test(id)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found with the provided ID.' });
    }

    res.json({ message: 'Product deleted successfully.' });

  } catch (error) {
    console.error('Delete product error:', error);

    res.status(500).json({ message: 'Server error deleting product. Please try again later.' });
  }
};

export default deleteProduct;