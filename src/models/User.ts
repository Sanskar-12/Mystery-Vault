import { Document, Schema, model, models } from "mongoose";
import { Message, MessageSchema } from "./Message";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  messages: Message[];
  isVerified:boolean
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password:{
    type:String,
    required:[true, "Password is required"],
  },
  verifyCode:{
    type:String,
    required:[true, "Verify code is required"],
  },
    verifyCodeExpiry:{
    type:Date,
    required:[true, "Verify code expiry is required"],
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  isAcceptingMessage:{
    type:Boolean,
    default:true
  },
  messages:[
    MessageSchema
  ]
});

export const User = models["User"] || model("User", UserSchema);