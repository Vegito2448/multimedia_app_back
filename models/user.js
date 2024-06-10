const { Schema, model } = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = Schema(
  {
    name: {
      type: String,
    },
    userName: {
      type: String,
      required: [true, "username is mandatory"],
      unique: true,
    },
    mail: {
      type: String,
      required: [true, "mail is mandatory"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is mandatory"],
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: "reader",
      enum: ["admin", "creator", "reader"],
    },
    status: {
      type: Boolean,
      default: true,
    },
    google: {
      type: Boolean,
      default: false,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Referencia al usuario administrador,
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

UserSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });

module.exports = model("User", UserSchema);
