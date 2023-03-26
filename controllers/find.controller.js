const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { User, Category, Product } = require("../models");

const allowedCollections = [
  'categories',
  'products',
  'roles',
  'users',
];

const findUsers = async (term = '', res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const user = await User.findById(term);
    return res.json({
      results: (user) ? [user] : []
    });
  }

  const regex = new RegExp(term, 'i');

  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }]
  });

  return res.json({
    quantity: users.length,
    results: users
  });
};
const findProducts = async (term = '', res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const product = await Product.findById(term).populate('user', ['name', 'mail']).populate('category', 'name');
    if (product)
      return res.json({
        results: (product) ? [product] : []
      });
    const userProduct = await Product.find({ user: new ObjectId(term), status: true })
      .populate('user', ['name', 'mail']).populate('category', 'name');
    if (userProduct.length)
      return res.json({
        results: userProduct
      });
    const categoryProduct = await Product.find({ status: true, category: new ObjectId(term) })
      .populate('category', 'name').populate('user', ['name', 'mail']);
    return res.json({
      results: categoryProduct
    });
  }

  const regex = new RegExp(term, 'i');


  const products = await Product.find({
    $or: [{ name: regex }, { description: regex }, { price: term && !isNaN(term) && Number(term) }],
    $and: [{ status: true }]
  }).populate('user', ['name', 'mail']).populate('category', 'name');

  return res.json({
    quantity: products.length,
    results: products
  });
};
const findCategories = async (term = '', res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const category = await Category.findById(term).populate('user', ['name', 'mail']);
    if (category)
      return res.json(category);
    const userCategory = await Category.find()
      .populate({
        path: 'user',
        match: { _id: term },
        select: ['name', 'mail']
      }).then(products => products.filter(category => category.user !== null));

    return res.json({
      results: userCategory
    });
  }

  const regex = new RegExp(term, 'i');


  const categories = await Category.find({
    name: regex,
    status: true
  }).populate('user', ['name', 'mail']);

  return res.json({
    quantity: categories.length,
    results: categories
  });
};

const find = (req = request, res = response) => {
  const { collection, searchTerm } = req.params;

  if (!allowedCollections.includes(collection) || !searchTerm) {
    res.status(400).json({
      msg: `Allowed collections are: ${allowedCollections}. The collection: ${collection} is not allowed, and the search term is required`
    });
  }

  switch (collection) {
    case 'categories':
      return findCategories(searchTerm, res);
    case 'products':
      return findProducts(searchTerm, res);
    case 'users':
      return findUsers(searchTerm, res);
    default:
      return res.status(500).json({
        msg: "This collection is not yet implemented"
      });
  }


};
module.exports = {
  find
};