import mongoose from "mongoose";

const childSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["parent", "child"],
      required: true,
    },
    childCode: {
      type: String,
      unique: true,
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Child = mongoose.model("Child", childSchema);
export default Child;
