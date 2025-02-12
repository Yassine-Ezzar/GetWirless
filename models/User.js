import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ["parent", "child"], required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: function () { return this.role === "parent"; } },
  childCode: { type: String, unique: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: function () { return this.role === "child"; } },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });



const User = mongoose.model("User", userSchema);
export default User;
