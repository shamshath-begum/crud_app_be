const mongoose=require('mongoose')
const validator=require('validator')

const UserSchema=new mongoose.Schema({
    fname:{type:String,required:true,trime:true},
    
    lname:{type:String,required:true,trime:true},
    email:{type:String,required:true,unique:true,
    validate:(value)=>validator.isEmail(value)
    },
     mobile:{type:String,required:true,unique:true,minlength:10,maxlength:10},
    gender:{type:String,required:true},
    status:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()}
},{versionKey:false})


const UserModel=mongoose.model('user',UserSchema)
module.exports={UserModel}