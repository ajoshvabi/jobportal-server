const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:String,
  about:String,
  stack:String,
  contact:Number,
  loginid:String,
  profile:String,
  cover:String,
  cv:String,
  email:String
});

const hrSchema = new mongoose.Schema({
  name:String,
  about:String,
  company:String,
  contact:Number,
  loginid:String,
  profile:String,
  cover:String
});

const loginSchema = new mongoose.Schema({
    email:String,
    password:String,
    usertype:Number
});

const postSchema =new mongoose.Schema({
  role:String,
  location:String,
  experience:Number,
  jobtype:String,
  description:String,
  photo:String,
  hrloginid:String,
  time:Date,

});

const apply = new mongoose.Schema({
  userid:String,
  postid:String,
});


const userRegModel = mongoose.model('user', userSchema);
const hrRegModel = mongoose.model('hr', hrSchema);
const loginModel = mongoose.model('login', loginSchema);
const postModel = mongoose.model('jobpost', postSchema);
const applyModel = mongoose.model('apply', apply);

module.exports = {userRegModel,loginModel,hrRegModel,postModel,applyModel }
