const path = require('path');
const fs = require('fs');
const { v2: cloudinary } = require("cloudinary");
cloudinary.config(process.env.CLOUDINARY_URL);
const { request, response } = require("express");
const { upFile, deleteCloudinaryFile, deleteLocalFile } = require("../helpers");
const { User, Content } = require("../models");

const uploadFile = async (req = request, res = response) => {
  if (!req.files || !Object.keys(req.files).length || !req.files.file)
    return res.status(400).json({ msg: "No files were uploaded." });

  try {
    //Images
    const name = await upFile(req.files);
    return res.json({ name });
  } catch (error) {
    console.log(
      "🚀 ~ file: uploads.controller.js:14 ~ uploadFile ~ error:",
      error
    );
    return res.status(400).json({ error });
  }
};

const updateImage = async (req = request, res = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "user":
      model = await User.findById(id);
      if (!model)
        return res.status(400).json({
          msg: `the user whit id: ${id} doesn't exists`,
        });
      break;
    case "content":
      model = await Content.findById(id);
      if (!model)
        return res.status(400).json({
          msg: `the content whit id: ${id} doesn't exists`,
        });
      break;

    default:
      return res.status(500).json({
        msg: `I forgot validate this`,
      });
  }

  //Clear Previous Images

  try {
    if (model.filePath) {
      //here you need to delete the image from the server
      const pathImage = path.join(
        __dirname,
        "../uploads/",
        collection,
        model.filePath
      );
      if (fs.existsSync(pathImage)) fs.unlinkSync(pathImage);
    }
  } catch (error) {}

  const name = await upFile(req.files, undefined, collection);
  model.filePath = name;
  await model.save();
  return res.json({
    collection,
    model,
  });
};

const updateImageCloudinary = async (req = request, res = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "user":
      model = await User.findById(id);
      break;
    case "content":
      model = await Content.findById(id);
      break;
    default:
      return res.status(500).json({
        msg: `I forgot validate this`,
      });
  }
  if (!model)
    return res.status(400).json({
      msg: `the collection: ${collection} whit id: ${id} doesn't exists`,
    });

  //Clear Previous Images

  try {
    if (model.filePath) {
      //here you need to delete the image from the server
      const nameArr = model.filePath.split("/");
      const nameFile = nameArr[nameArr.length - 1];
      const [public_id] = nameFile.split(".");
      cloudinary.uploader.destroy(public_id);
    }
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  // const name = await upFile(req.files, ['png', 'jpg', 'jpeg', 'gif'], collection);
  model.filePath = secure_url;
  await model.save();
  return res.json({
    collection,
    model,
  });
};

const showImage = async (req = request, res = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "user":
      model = await User.findById(id);
      break;
    case "content":
      model = await Content.findById(id);
      break;
    default:
      return res.status(500).json({
        msg: `I forgot validate this`,
      });
  }
  if (!model)
    return res.status(400).json({
      msg: `the collection: ${collection} whit id: ${id} doesn't exists`,
    });

  try {
    if (model.filePath) {
      //here you need to delete the image from the server
      const pathImage = path.join(
        __dirname,
        "../uploads",
        collection,
        model.filePath
      );
      if (fs.existsSync(pathImage)) {
        return res.sendFile(pathImage);
      }
    }
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
  const pathNoImage = path.join(__dirname, "../assets/no-image.jpg");
  return res.sendFile(pathNoImage);
};

const deleteFile = async (req = request, res = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "user":
      model = await User.findById(id);
      if (!model)
        return res.status(400).json({
          msg: `The user with id: ${id} doesn't exist`,
        });
      break;
    case "content":
      model = await Content.findById(id);
      if (!model)
        return res.status(400).json({
          msg: `The content with id: ${id} doesn't exist`,
        });
      break;
    default:
      return res.status(500).json({
        msg: `Collection not validated`,
      });
  }

  if (!model.filePath)
    return res.status(400).json({
      msg: `The model does not have an image to delete`,
    });

  try {
    // Eliminar imagen del servidor local si existe
    const localPath = path.join(
      __dirname,
      "../uploads",
      collection,
      model.filePath
    );
    deleteLocalFile(localPath);

    // Eliminar imagen de Cloudinary si existe
    await deleteCloudinaryFile(model.filePath);

    // Remover la referencia de la imagen del modelo
    model.filePath = null;
    await model.save();

    return res.json({
      msg: `File deleted successfully`,
      model,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).json({
      msg: "An error occurred while deleting the file",
      error,
    });
  }
};

module.exports = {
  uploadFile,
  updateImage,
  showImage,
  updateImageCloudinary,
  deleteFile,
};