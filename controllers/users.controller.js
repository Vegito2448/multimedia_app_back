const { request, response } = require('express');
const bcryptjs = require('bcryptjs');


const User = require('../models/user');

const usersGet = async (req = request, res = response) => {
	const { limit = 5, from = 0 } = req.query;
	const query = { status: true };

	const [total, users] = await Promise.all([User.countDocuments(query), User.find(query).skip(parseInt(from)).limit(parseInt(limit))]);

	res.json({
		total,
		users,
	});
};
const usersPost = async (req = request, res = response) => {
  // const { _id: createdBy } = req.user;

  const { name, mail, password, role, userName, createdBy } = req.body;

  const user = new User({ name, mail, password, role, userName, createdBy });

  //Encrypt password
  const salt = bcryptjs.genSaltSync();

  user.password = bcryptjs.hashSync(password, salt);
  user.createdBy = createdBy;

  try {
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({
      msg:
        "has been an error, talk with backend administrator, error:" +
        error.message,
    });
  }
};

const usersPut = async (req = request, res = response) => {
  const { _id: updatedBy } = req.user;
  const { id } = req.params;
  const { _id, google, password, ...rest } = req.body;

  //TODO validate BD
  if (password) {
    //Encrypt password
    const salt = bcryptjs.genSaltSync();

    Object.assign(rest, {
      updatedBy,
      password: bcryptjs.hashSync(password, salt),
    });
  }
  const user = await User.findByIdAndUpdate(id, rest)
    .populate("updatedBy", "name")
    .populate("createdBy", "name")
    .populate("deletedBy", "name");

  res.json({ msg: "User Updated", user });
};

const usersDelete = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id: deletedBy } = req.user;

  //Physical delete this action isn't recommended
  // const user = await User.findByIdAndDelete(id);

  //Change status user
  const user = await User.findByIdAndUpdate(id, {
    status: false,
    deletedBy,
    updatedBy: deletedBy,
  })
    .populate("deletedBy", "name")
    .populate("createdBy", "name")
    .populate("updatedBy", "name");

  res.json({ user });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
};
