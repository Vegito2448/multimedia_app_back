const { request, response } = require("express");

const { Topic } = require("../models");

// getTopics - paginated - total - populate
const getTopics = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };
  try {
    const [total, topics] = await Promise.all([
      Topic.countDocuments(query),
      Topic.find(query)
        .populate("createdBy", "name")
        .populate("updatedBy", "name")
        .populate("deletedBy", "name")
        .skip(parseInt(from))
        .limit(parseInt(limit)),
    ]);

    res.status(200).json({
      total,
      topics,
    });
  } catch (error) {
    throw new Error(
      res.status(500).json({
        msg: `has been an error: ${error.message}, talk with backend administrator`,
      })
    );
  }
};

// getTopic - populate {}
const getTopic = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const topic = await Topic.findById(id)
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .populate("deletedBy", "name");

    return res.status(200).json(topic);
  } catch (error) {
    throw new Error(
      res.status(500).json({
        msg: `has been an error: ${error.message}, talk with backend administrator`,
      })
    );
  }
};

const createTopic = async (req = request, res = response) => {
  const { _id: createdBy } = req.user;
  let { name, allowedContentTypes } = req.body;
  name = req.body.name.toUpperCase();

  try {
    const data = {
      name,
      allowedContentTypes,
      createdBy,
    };

    const newTopic = new Topic(data);
    await newTopic.save();

    await newTopic.populate("createdBy", "name");

    return res.status(201).json(newTopic);
  } catch (error) {
    console.error(error);
    throw new Error(
      res.status(500).json({
        msg: `has been an error: ${error.message}, talk with backend administrator`,
      })
    );
  }
};

// updateTopic - populate
const updateTopic = async (req = request, res = response) => {
  const { _id: updatedBy } = req.user;

  const { id } = req.params;

  const { name, allowedContentTypes, status } = req.body;
  const data = {
    name,
    allowedContentTypes,
    updatedBy,
    status,
  };

  try {
    const updatedTopic = await Topic.findByIdAndUpdate(id, data, { new: true })
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .populate("deletedBy", "name");

    return res.status(200).json(updatedTopic);
  } catch (error) {
    throw new Error(
      res.status(500).json({
        msg: `has been an error:\n ${error.message}, talk with backend administrator`,
      })
    );
  }
};

// deleteTopic - status: false
const deleteTopic = async (req = request, res = response) => {
  const { _id: deletedBy } = req.user;
  const { id } = req.params;
  try {
    const topic = await Topic.findByIdAndUpdate(
      id,
      { status: false, deletedBy },
      { new: true }
    )
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .populate("deletedBy", "name");

    return res.status(200).json({
      msg: "Topic deleted",
      topic,
    });
  } catch (error) {
    throw new Error(
      res.status(500).json({
        msg: `has been an error: ${error.message}, talk with backend administrator`,
      })
    );
  }
};

module.exports = {
  updateTopic,
  getTopics,
  getTopic,
  createTopic,
  deleteTopic,
};
