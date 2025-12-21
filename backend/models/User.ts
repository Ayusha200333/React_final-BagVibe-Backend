// import { match } from "node:assert"
// import { timeStamp } from "node:console"

// const mongoose = require("mongoose")
// const bcrypt = require("bcryptjs")

// const userSchema = new mongoose.Schema(
//     {
//         name: {
//             type:String,
//             required:true,
//             trim:true,
//         },
//         email:{
//             type:String,
//             required:true,
//             unique:true,
//             trim:true,
//             match:[/.+\@.+\..+/, "Please enter a valid email address"],
//         },
//         password:{
//             type:String,
//             required:true,
//             minLength:6,
//         },
//         role:{
//             type:String,
//             enum:["customer","admin"],
//             default:"customer",
//         },
//     },
//     {timestamps : true}
// )

// userSchema.pre("save",async function (next) {
//     if(!this.isModified("password")) return next()
//     const salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password , salt)
//     next()
// })

// userSchema.methods.matchPassword = async function (enteredPassword){
//     return await bcrypt.compare(enteredPassword,this.password)
// }

// module.exports = mongoose.model("User",userSchema)



import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);

// 🔐 Password hashing (NO next())
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 Compare password
userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
