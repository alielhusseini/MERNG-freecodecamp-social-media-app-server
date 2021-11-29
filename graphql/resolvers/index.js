const postResolvers = require('./postResolvers')
const userResolvers = require('./userResolvers')
const commentResolvers = require('./postCommentsResolvers')

module.exports = {
    Post: { // modifier: each time a mutation, query &/or subscription occurs that returns a Post Type, will first pass through the Post modifier & apply the modifications
        likeCount(parent) { return parent.likes.length },
        commentCount: (parent) => parent.comments.length
    },
    Query: {
        ...postResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Muttation,
    },
    // Subscription: {
    //     ...postResolvers.Subscription
    // }
}