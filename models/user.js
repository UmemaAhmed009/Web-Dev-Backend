const mongoose = require('mongoose');
const Role = require("../models/role");
const bcrypt= require ('bcrypt');  

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true
    },
    password:
    {
        type: String,
        required: true
    },
    role_id:
    {
        type: mongoose.Schema.Types.Number,
        //type: Number,
        required: true,
        ref: 'Role'
    }
})

userSchema.pre('save', async function (next) {
    try {
      if (this.isNew) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
      }
      next()
    } catch (error) {
      next(error)
    }
})

userSchema.methods.isValidPassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password)
    } catch (error) {
      throw error
    }
}
  

module.exports = mongoose.model("User", userSchema);