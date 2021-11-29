const User = require('../../models/User')
const { hash, genSalt, compare } = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server') // for handeling errors
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators')

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    }, process.env.SECRET, {
        expiresIn: '1h'
    })
}

module.exports = {
    Mutation: {
        async register(parent, args, context, info) { // we could destructure right away in the parameters --> { registerInput: { username, email, password, confirmPassword } }
            try {
                const { username, email, password, confirmPassword } = args.registerInput

                // check if the inputs are filled & the passwords match
                const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
                if (!valid) throw new UserInputError('Errors', { errors })

                // check if there isn't duplicate usernames in the app
                const user = await User.findOne({ username })
                if (user) throw new UserInputError('User is taken', { errors: { username: 'This username is taken' } }) // the throw isn't properly working change it by return

                // hashed password, save the new user, create a token
                const salt = await genSalt(12)
                const hashedPassword = await hash(password, salt) // or await hash(password, 12)

                const newUser = new User({ email, username, password: hashedPassword, createdAt: new Date().toISOString() })

                const res = await newUser.save()
                const token = generateToken(res)

                return {
                    ...res._doc,
                    id: res._id,
                    token
                }
            } catch (err) {
                throw new Error(err)
            }
        },
        async login(parent, { username, password }, context, info) {
            try {
                // for input validations (username & password)
                const { errors, valid } = validateLoginInput(username, password)
                if (!valid) throw new UserInputError('Wrong credentials', { errors })

                // check if the user exists in db
                const user = await User.findOne({ username })
                if (!user) {
                    errors.general = 'User not found'
                    throw new UserInputError('User not found', { errors })
                }

                // check if the passwords match
                const match = await compare(password, user.password)
                if (!match) {
                    errors.general = 'Wrong credentials'
                    throw new UserInputError('Wrong credentials', { errors })
                }

                const token = generateToken(user)
                return {
                    ...user._doc,
                    id: user._id,
                    token
                }
            } catch (err) {
                throw new Error(err)
            }
        }
    }
}