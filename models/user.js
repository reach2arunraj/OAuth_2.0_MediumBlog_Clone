const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose")
const findOrCreate = require('mongoose-findorcreate')


const userSchema = new mongoose.Schema({
  username:{
    type:String
  },
  password:{
    type:String
  },
  googleId:{
    type:String
  },
  displayName:{
    type:String
  },
  photo:{
    type:String
  }
})

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema)