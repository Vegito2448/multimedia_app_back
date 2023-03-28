const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { request, response } = require("express");
const { upFile } = require("../helpers");
const { User, Product } = require("../models");
const uploadFile = async (req = request, res = response) => {

  if (!req.files || !Object.keys(req.files).length || !req.files.file)
    return res.status(400).json({ msg: 'No files were uploaded.' });

  try {
    //Images
    const name = await upFile(req.files, ['png', 'jpg', 'jpeg', 'gif']);
    return res.json({ name });
  } catch (error) {
    console.log("🚀 ~ file: uploads.controller.js:14 ~ uploadFile ~ error:", error);
    return res.status(400).json({ error });
  }
};

const updateImage = async (req = request, res = response) => {

  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case 'user':
      model = await User.findById(id);
      if (!model)
        return res.status(400).json({
          msg: `the user whit id: ${id} doesn't exists`
        });
      break;
    case 'product':
      model = await Product.findById(id);
      if (!model)
        return res.status(400).json({
          msg: `the product whit id: ${id} doesn't exists`
        });
      break;

    default:
      return res.status(500).json({
        msg: `I forgot validate this`
      });
  }

  //Clear Previous Images

  try {
    if (model.image) {
      //here you need to delete the image from the server
      const pathImage = path.join(__dirname, '../uploads/', collection, model.image);
      if (fs.existsSync(pathImage))
        fs.unlinkSync(pathImage);
    }
  } catch (error) {

  }

  const name = await upFile(req.files, ['png', 'jpg', 'jpeg', 'gif'], collection);
  model.image = name;
  await model.save();
  return res.json({
    collection,
    model
  });
};
const updateImageCloudinary = async (req = request, res = response) => {

  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case 'user':
      model = await User.findById(id);
      break;
    case 'product':
      model = await Product.findById(id);
      break;
    default:
      return res.status(500).json({
        msg: `I forgot validate this`
      });
  }
  if (!model)
    return res.status(400).json({
      msg: `the collection: ${collection} whit id: ${id} doesn't exists`
    });

  //Clear Previous Images

  try {
    if (model.image) {
      //here you need to delete the image from the server
      const nameArr = model.image.split('/');
      const nameFile = nameArr[nameArr.length - 1];
      const [public_id] = nameFile.split('.');
      cloudinary.uploader.destroy(public_id);
    }
  } catch (error) {

  }
  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  // const name = await upFile(req.files, ['png', 'jpg', 'jpeg', 'gif'], collection);
  model.image = secure_url;
  await model.save();
  return res.json({
    collection,
    model
  });
};

const showImage = async (req = request, res = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case 'user':
      model = await User.findById(id);
      break;
    case 'product':
      model = await Product.findById(id);
      break;
    default:
      return res.status(500).json({
        msg: `I forgot validate this`
      });
  }
  if (!model)
    return res.status(400).json({
      msg: `the collection: ${collection} whit id: ${id} doesn't exists`
    });



  try {
    if (model.image) {
      //here you need to delete the image from the server
      const pathImage = path.join(__dirname, '../uploads', collection, model.image);
      if (fs.existsSync(pathImage)) {
        return res.sendFile(pathImage);
      }

    }
  } catch (error) {
    return res.status(400).json({
      error
    });
  }
  const pathNoImage = path.join(__dirname, '../assets/no-image.jpg');
  return res.sendFile(pathNoImage);

};

module.exports = {
  uploadFile,
  updateImage,
  showImage,
  updateImageCloudinary
};