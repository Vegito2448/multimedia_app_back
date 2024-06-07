const { request, response } = require('express');
const bcryptjs = require('bcryptjs');


const { Category } = require('../models');

// getCategories - paginated - total - populate
const getCategories = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };
  try {
    const [total, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query)
        .populate("createdBy", "name")
        .populate("updatedBy", "name")
        .populate("deletedBy", "name")
        .skip(parseInt(from))
        .limit(parseInt(limit)),
    ]);

    res.status(200).json({
      total,
      categories,
    });
  } catch (error) {
    throw new Error(
      res.status(500).json({
        msg: "has been an error, talk with backend administrator",
      })
    );
  }
};
// getCategory - populate {}
const getCategory = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id).populate("createdBy", "name");
    return res.status(200).json(category);
  } catch (error) {
    throw new Error(
      res.status(500).json({
        msg: "has been an error, talk with backend administrator",
      })
    );
  }
};

const createCategory = async (req = request, res = response) => {
  const { _id: createdBy } = req.user;
  let { name, type } = req.body;
  name = name.toUpperCase();
  console.log(
    "🚀 ~ file: categories.controller.js:12 ~ createCategory ~ name:",
    name
  );

  try {
    //Verify if Email exist

    const category = await Category.findOne({ name });

    if (category) {
      return res.status(400).json({
        msg: "Category already exist",
      });
    }

    const data = {
      name,
      createdBy,
      type,
    };

    const newCategory = new Category(data);

    await newCategory.save();

    return res.status(201).json(newCategory);
  } catch (error) {
    throw new Error(
      res.status(500).json({
        msg:
          "has been an error, talk with backend administrator, error:" +
          error.message,
      })
    );
  }
};

// updateCategory
const updateCategory = async (req = request, res = response) => {
  const { _id: updatedBy } = req.user;
  const { id } = req.params;
  let { name, type, status } = req.body;

  name = name.toUpperCase();

  const data = {
    name,
    type,
    updatedBy,
    status,
  };

  try {
    const category = await Category.findByIdAndUpdate(id, data, { new: true })
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .populate("deletedBy", "name");

    return res.status(200).json(category);
  } catch (error) {
    throw new Error(
      res.status(500).json({
        msg: `has been an error:\n${error.message}, talk with backend administrator`,
      })
    );
  }
};

// deleteCategory - status: false
const deleteCategory = async (req = request, res = response) => {
  const { _id: deletedBy } = req.user;
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { status: false, deletedBy },
      { new: true }
    );
    return res.status(200).json({
      msg: "Category deleted",
      category,
    });
  } catch (error) {
    throw new Error(
      res.status(500).json({
        msg: "has been an error, talk with backend administrator",
      })
    );
  }
};

module.exports = {
  updateCategory,
  getCategories,
  getCategory,
  createCategory,
  deleteCategory,
};
