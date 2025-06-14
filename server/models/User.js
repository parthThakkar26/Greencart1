import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
    },

    email:{
        type:String,
        required:true,
        unique:true,
    },

    password:{
        type:String,
        required:true
    },

    cartItems:{
        type:Object,
        default :{}
    }

}, {minimize:false})  //minimize false means we will create the  user  with empty object data

const User = mongoose.models.user ||  mongoose.model('user',userSchema)

export default User;    
