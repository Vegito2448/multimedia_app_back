const { request, response } = require('express');

const { Product } = require('../models');

// getProducts - paginated - total - populate
const getProducts = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };
  try {
    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate('user', 'name').populate('category', 'name')
        .skip(parseInt(from))
        .limit(parseInt(limit))
    ]);

    res.status(200).json({
      total,
      products,
    });

  } catch (error) {
    throw new Error(res.status(500).json({
      msg: `has been an error: ${error}, talk with backend administrator`
    }));
  }
};

// getProduct - populate {}
const getProduct = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate('user', 'name').populate('category', 'name');
    return res.status(200).json(product);
  } catch (error) {
    throw new Error(res.status(500).json({
      msg: `has been an error: ${error}, talk with backend administrator`
    }));
  }
};

const createProduct = async (req = request, res = response) => {
  const { _id: user } = req.user;
  const { price = 0, category, description = '' } = req.body;
  const name = req.body.name.toUpperCase();

  try {

    //Verify if Email exist

    const product = await Product.findOne({ name });

    if (product) {
      return (res.status(400).json({
        msg: "Product already exist"
      }));
    }

    const data = {
      name,
      price,
      category,
      user,
      description
    };

    const newProduct = await Product.create(data);
    await Product.populate(newProduct, [{ path: 'user' }, { path: 'category' }]);


    return res.status(201).json(newProduct);


  } catch (error) {
    throw new Error(res.status(500).json({
      msg: `has been an error: ${error}, talk with backend administrator`
    }));
  }

};

// updateProduct - populate
const updateProduct = async (req = request, res = response) => {
  const { _id: user } = req.user;
  const { id } = req.params;
  const product = await Product.findById(id);
  let { name = product.name, price = product.price, category = product.category, description = product.description } = req.body;
  name = name.toUpperCase();
  const data = {
    name,
    price,
    category,
    user,
    description
  };
  Object.assign(product, data);
  try {
    await product.save();
    await Product.populate(product, [{ path: 'user' }, { path: 'category' }]);
    return res.status(200).json(product);

  } catch (error) {
    throw new Error(res.status(500).json({
      msg: `has been an error:\n${error}, talk with backend administrator`
    }));
  }

};

// deleteProduct - status: false
const deleteProduct = async (req = request, res = response) => {
  const { _id: user } = req.user;
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, { status: false, user, available: false }, { new: true }).populate('user', 'name').populate('category', 'name');
    return res.status(200).json({
      msg: 'Category deleted'
    });
  } catch (error) {
    throw new Error(res.status(500).json({
      msg: `has been an error: ${error}, talk with backend administrator`
    }));
  }
};

module.exports = {
  updateProduct,
  getProducts,
  getProduct,
  createProduct,
  deleteProduct
};
