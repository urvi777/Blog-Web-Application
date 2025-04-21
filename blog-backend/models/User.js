import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"; // CommonJS import
import jwt from "jsonwebtoken"; // CommonJS import

const { hash, compare } = bcrypt;
const { sign } = jwt;

const UserSchema = new Schema(
  {
    avatar: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

UserSchema.methods.generateJWT = function () {
  return sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return compare(enteredPassword, this.password);
};

const User = model("User", UserSchema);
export default User;