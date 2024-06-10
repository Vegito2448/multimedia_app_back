const {Schema,model} = require('mongoose');

const RoleSchema = Schema(
  {
    role: {
      type: String,
      required: [true, "role is mandatory"],
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);



module.exports = model("Role",RoleSchema);