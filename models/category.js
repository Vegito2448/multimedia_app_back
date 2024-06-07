const { Schema, model } = require('mongoose');

const uniqueValidator = require("mongoose-unique-validator");

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, "name is mandatory"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  type: {
    type: String,
    required: true,
    enum: ["image", "video", "text", "audio", "document"],
  },
});

CategorySchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

CategorySchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });

module.exports = model("Category", CategorySchema);