const { request, response } = require("express");
const { uploadFileCloudinary } = require("../helpers");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const usersGet = async (req = request, res = response) => {
  let { limit = 5, from = 0 } = req.query;
  limit = parseInt(limit) > 0 ? parseInt(limit) : 5;
  from = parseInt(from) > 0 ? parseInt(from) : 0;

  const query = { status: true };

  try {
    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).lean().skip(from).limit(limit),
    ]);

    res.json({
      total,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los usuarios, Error: " + error.message,
    });
  }
};

const userGet = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .populate("deletedBy", "name");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      msg:
        "has been an error, talk with backend administrator, error: " +
        error.message,
    });
  }
};

const usersPost = async (req = request, res = response) => {
  const createdBy = req.user?._id ?? null;

  const file = req?.files?.file;

  const { name, mail, password, role, userName } = req.body;

  const data = { name, mail, password, role, userName, createdBy };

  const user = new User(data);

  //Encrypt password
  const salt = bcryptjs.genSaltSync();

  user.password = bcryptjs.hashSync(password, salt);

  user.createdBy = createdBy;

  try {
    if (file) {
      const secure_url = await uploadFileCloudinary(file, {
        model: user,
        collection: "user",
      });
    }

    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({
      msg:
        "has been an error, talk with backend administrator, ERROR DETAILS: " +
        error.message,
    });
  }
};

const usersPut = async (req = request, res = response) => {
  const { _id: updatedBy } = req.user;

  const file = req?.files?.file;

  const { id } = req.params;

  const { name, userName, mail, password, role } = req.body;

  const data = {
    updatedBy,
    name,
    userName,
    mail,
    role,
  };

  //TODO validate BD
  if (password) {
    //Encrypt password
    const salt = bcryptjs.genSaltSync();

    data.password = bcryptjs.hashSync(password, salt);
  }

  try {
    const user = await User.findById(id);
    if (file)
      await uploadFileCloudinary(file, { model: user, collection: "user" });

    Object.assign(user, data);

    await user.save();

    await User.populate(user, {
      path: "createdBy",
      select: "name",
      path: "updatedBy",
      select: "name",
    });

    res.status(200).json({ msg: "User Updated", user });
  } catch (error) {
    return res.status(500).json({
      msg:
        "has been an error, talk with backend administrator, ERROR DETAILS: " +
        error.message,
    });
  }
};

const usersDelete = async (req = request, res = response) => {
  const { id } = req.params;
  // const { _id: deletedBy } = req.user;
  const deletedBy = req.user?._id ?? null;

  //Physical delete this action isn't recommended
  // const user = await User.findByIdAndDelete(id);

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        status: false,
        deletedBy,
        updatedBy: deletedBy,
        deletedAt: new Date(),
      },
      {
        new: true,
      }
    );

    res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      msg:
        "has been an error, talk with backend administrator, ERROR DETAILS: " +
        error.message,
    });
  }
  //Change status user
};

module.exports = {
  usersGet,
  userGet,
  usersPost,
  usersPut,
  usersDelete,
};
