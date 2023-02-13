const mongoose = require ('mongoose');
// const router = require('../routes/aliens');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9]*[a-z0-9])?/
    },

    password: {
        type: String,
        required: true 
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
  


module.exports = mongoose.model('Alien', userSchema)