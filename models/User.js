const { model, Schema } = require('mongoose')

const userSchema = new Schema({ // we'll handle the required fields in the graphql schema side & not the model mongoose side
    username: String,
    password: String,
    email: String,
    createdAt: String
})

module.exports = model('mernguser', userSchema)