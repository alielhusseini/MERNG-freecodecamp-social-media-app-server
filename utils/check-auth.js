const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

// our middleware for auth
module.exports = (context) => {
  // context = { ... headers } this context is the req body which as many things but all we need is the header for the auth check
  const authHeader = context.req.headers.authorization
  if (authHeader) {
    // Bearer token
    const token = authHeader.split('Bearer ')[1]
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET)
        return user
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token')
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]'")
  }
  throw new Error('Authorization header must be provided')
}