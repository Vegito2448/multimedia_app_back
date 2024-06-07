const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { User, Category, Topic, Content } = require("../models");

const allowedCollections = [
  "categories",
  "roles",
  "users",
  "topics",
  "contents",
];

const findUsers = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const user = await User.findById(term);
    return res.json({
      results: user ? [user] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const users = await User.find({
    $or: [
      { name: regex },
      { mail: regex },
      { role: regex },
      { userName: regex },
    ],
    $and: [{ status: true }],
  });

  return res.json({
    quantity: users.length,
    results: users,
  });
};

const findContents = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const content = await Content.findById(term)
      .populate("createdBy", ["name", "mail"])
      .populate("updatedBy", ["name", "mail"])
      .populate("deletedBy", ["name", "mail"])
      .populate("category", "name")
      .populate("topic", "name");

    if (content)
      return res.json({
        results: content ? [content] : [],
      });

    const userContent = await Content.find({
      user: new ObjectId(term),
      status: true,
    })
      .populate("createdBy", ["name", "mail"])
      .populate("updatedBy", ["name", "mail"])
      .populate("deletedBy", ["name", "mail"])
      .populate("category", "name")
      .populate("topic", "name");

    if (userContent.length)
      return res.json({
        results: userContent,
      });

    const categoryContent = await Content.find({
      status: true,
      category: new ObjectId(term),
    })
      .populate("category", "name")
      .populate("createdBy", ["name", "mail"])
      .populate("updatedBy", ["name", "mail"])
      .populate("deletedBy", ["name", "mail"]);

    return res.json({
      results: categoryContent,
    });
  }

  const regex = new RegExp(term, "i");

  const contents = await Content.find({
    $or: [
      { title: regex },
      { description: regex },
      { type: regex },
      { url: regex },
      { filePath: regex },
    ],
    $and: [{ status: true }],
  })
    .populate("createdBy", ["name", "mail"])
    .populate("updatedBy", ["name", "mail"])
    .populate("deletedBy", ["name", "mail"])
    .populate("category", "name")
    .populate("topic", "name");

  return res.json({
    quantity: contents.length,
    results: contents,
  });
};
const findTopics = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const topic = await Topic.findById(term)
      .populate("createdBy", ["name", "mail"])
      .populate("updatedBy", ["name", "mail"])
      .populate("deletedBy", ["name", "mail"])
      .populate("category", "name")
      .populate("topic", "name");
    if (topic)
      return res.json({
        results: topic ? [topic] : [],
      });
    const userTopic = await Topic.find({
      user: new ObjectId(term),
      status: true,
    })
      .populate("createdBy", ["name", "mail"])
      .populate("updatedBy", ["name", "mail"])
      .populate("deletedBy", ["name", "mail"])
      .populate("category", "name")
      .populate("topic", "name");
    if (userTopic.length)
      return res.json({
        results: userTopic,
      });
    const categoryTopic = await Topic.find({
      status: true,
      category: new ObjectId(term),
    })
      .populate("category", "name")
      .populate("createdBy", ["name", "mail"])
      .populate("updatedBy", ["name", "mail"])
      .populate("deletedBy", ["name", "mail"]);
    return res.json({
      results: categoryTopic,
    });
  }

  const regex = new RegExp(term, "i");

  const contents = await Topic.find({
    $or: [
      { name: regex },
      { description: regex },
      { price: term && !isNaN(term) && Number(term) },
    ],
    $and: [{ status: true }],
  })
    .populate("createdBy", ["name", "mail"])
    .populate("updatedBy", ["name", "mail"])
    .populate("deletedBy", ["name", "mail"])
    .populate("category", "name")
    .populate("topic", "name");

  return res.json({
    quantity: contents.length,
    results: contents,
  });
};
const findCategories = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const category = await Category.findById(term).populate("user", [
      "name",
      "mail",
    ]);
    if (category) return res.json(category);
    const userCategory = await Category.find()
      .populate({
        path: "user",
        match: { _id: term },
        select: ["name", "mail"],
      })
      .then((contents) =>
        contents.filter((category) => category.user !== null)
      );

    return res.json({
      results: userCategory,
    });
  }

  const regex = new RegExp(term, "i");

  const categories = await Category.find({
    name: regex,
    status: true,
  })
    .populate("createdBy", ["name", "mail"])
    .populate("updatedBy", ["name", "mail"])
    .populate("deletedBy", ["name", "mail"]);

  return res.json({
    quantity: categories.length,
    results: categories,
  });
};

const find = (req = request, res = response) => {
  const { collection, searchTerm } = req.params;

  if (!allowedCollections.includes(collection) || !searchTerm) {
    res.status(400).json({
      msg: `Allowed collections are: ${allowedCollections}. The collection: ${collection} is not allowed, and the search term is required`,
    });
  }

  switch (collection) {
    case "categories":
      return findCategories(searchTerm, res);
    case "contents":
      return findContents(searchTerm, res);
    case "users":
      return findUsers(searchTerm, res);
    case "topics":
      return findTopics(searchTerm, res);
    default:
      return res.status(500).json({
        msg: "This collection is not yet implemented",
      });
  }
};
module.exports = {
  find
};