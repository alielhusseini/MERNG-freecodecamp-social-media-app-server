const { AuthenticationError } = require('apollo-server')
const Post = require('../../models/Post')
const checkAuth = require('../../utils/check-auth')
  
module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 })
                return posts 
            } catch(err) {
                throw new Error(err)
            }
        },
        async getPost(parent,{ postId }) {
            try {
                const post = await Post.findById(postId)
                if (post) return post
                throw new Error('Post not found')
            } catch (err) {
                throw new Error(err)
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) { // if there's no parent we can replace it by _
            const user = checkAuth(context)

            if (body.trim() === '') throw new Error('Post body must not be empty')

            const newPost = new Post({ 
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })
            const post = await newPost.save()
            return post
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context)
            try {
                const post = await Post.findById(postId)
                if (user.username === post.username) { 
                    await post.delete(postId)
                    return 'Post deleted successfully'
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } catch (err) {
                throw new Error(err)
            }
        }
    }
} 