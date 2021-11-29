const { UserInputError, AuthenticationError } = require('apollo-server')
const Post = require('../../models/Post')
const checkAuth = require('../../utils/check-auth')

// es6 example syntax
module.exports = {
    Muttation: {
        createComment: async(_, { postId, body }, context) => {
            try {
                const { username } = checkAuth(context)

                if (body.trim() === '') throw UserInputError('Empty comment', { erros: { body: 'Comment body must not be empty' } })

                const post = await Post.findById(postId)
                if (post) {
                    post.comments.unshift({ body, username, createdAt: new Date().toISOString() })
                    await post.save()
                    return post
                } else {
                    throw new UserInputError('Post not found')
                }
            } catch (err) {
                throw new Error(err)
            }
        },
        deleteComment: async(_, { postId, commentId }, context) => {
            try {
                const { username } = checkAuth(context)

                const post = await Post.findById(postId)
                if (post) {
                    const commentIndex = post.comments.findIndex(comment => comment.id === commentId)

                    //checking if the user is the creator of the comment, if he is can delete his own comment
                    if (post.comments[commentIndex].username === username) {
                        post.comments.splice(commentIndex, 1)
                        await post.save()
                        return post
                    } else {
                        throw new AuthenticationError('Action not allowed')
                    }
                } else {
                    throw new UserInputError('Post not found')
                }

            } catch (err) {
                throw new Error(err)
            }
        }
    }
}