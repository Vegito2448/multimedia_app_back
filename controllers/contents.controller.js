const { request, response } = require("express");

const { Content } = require("../models");

// getContents - paginated - total - populate
const getContents = async (req = request, res = response) => {
  const { limit = 5, from = 0, topic } = req.query;
  const query = { status: true };
  try {
    const [total, contents] = await Promise.all([
      Content.countDocuments(query),
      Content.find(query)
        .populate({
          path: "createdBy",
          select: "userName image",
        })
        .populate("updatedBy", "name")
        .populate("deletedBy", "name")
        .populate("topic", "name")
        .populate("category", "name")
        .skip(parseInt(from))
        .limit(parseInt(limit)),
    ]);

    res.status(200).json({
      total,
      contents,
    });
  } catch (error) {
    return res.status(500).json({
      msg:
        "has been an error, talk with backend administrator, error: " +
        error.message,
    });
  }
};

// getContent - populate {}
const getContent = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const content = await Content.findById(id)
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .populate("deletedBy", "name")
      .populate("topic", "name")
      .populate("category", "name");

    return res.status(200).json({
      msg: "Content found",
      content,
    });
  } catch (error) {
    throw new Error(
      res.status(500).json({
        msg: "has been an error, talk with backend administrator",
      })
    );
  }
};

const createContent = async (req = request, res = response) => {
  const { _id: createdBy } = req.user;
  let {
    title,
    description,
    type,
    url = "",
    filePath = "",
    category,
    topic,
  } = req.body;
  title = title.toUpperCase();

  const data = {
    title,
    createdBy,
    description,
    type,
    url,
    filePath,
    category,
    topic,
  };

  const newContent = new Content(data);

  try {
    await newContent.save();

    await Content.populate(newContent, {
      path: "createdBy",
      select: "name",
    });

    return res.status(201).json({
      msg: "Content created",
      content: newContent,
    });
  } catch (error) {
    throw new Error(
      res.status(500).json({
        msg: "has been an error, talk with backend administrator",
      })
    );
  }
};

// updateContent
const updateContent = async (req = request, res = response) => {
  const { _id: updatedBy } = req.user;
  const { id } = req.params;
  let {
    title,
    description,
    type,
    url = "",
    filePath = "",
    category,
    topic,
  } = req.body;
  title = title.toUpperCase();
  const data = {
    title,
    updatedBy,
    description,
    type,
    url,
    filePath,
    category,
    topic,
  };
  try {
    const content = await Content.findByIdAndUpdate(id, data, { new: true })
      .populate("updatedBy", "name")
      .populate("deletedBy", "name")
      .populate("createdBy", "name");

    return res.status(200).json({
      msg: "Content updated",
      content,
    });
  } catch (error) {
    throw new Error(
      res.status(500).json({
        msg: `has been an error:\n ${error.message}, talk with backend administrator`,
      })
    );
  }
};

// deleteContent - status: false
const deleteContent = async (req = request, res = response) => {
  const { _id: deletedBy } = req.user;

  const { id } = req.params;

  try {
    const content = await Content.findByIdAndUpdate(
      id,
      { status: false, deletedBy },
      { new: true }
    )
      .populate("deletedBy", "name")
      .populate("createdBy", "name")
      .populate("updatedBy", "name");
    return res.status(200).json({
      msg: "Content deleted",
      content,
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
  updateContent,
  getContents,
  getContent,
  createContent,
  deleteContent,
};
