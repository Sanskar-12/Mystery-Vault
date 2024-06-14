import { Document, Schema, model, models } from "mongoose";


export interface Message extends Document {
    content:string,
    createdAt:Date
}

export const MessageSchema:Schema<Message>=new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export const Message = models["Message"] || model("Message",MessageSchema)