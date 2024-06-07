const { Schema, model } = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const contentSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  type: { type: String, required: true, enum: ["image", "video", "text"] },
  url: { type: String },
  filePath: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
  deletedBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
  status: { type: Boolean, default: true, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
});

contentSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });

module.exports = model("Content", contentSchema);
