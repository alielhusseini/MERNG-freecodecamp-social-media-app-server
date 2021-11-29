const gql = require('graphql-tag') // for writing graphql queries, mutations, schemas, subscription

module.exports = gql `
    # schemas:
    type Post {  
        id: ID! # filling the fields & their type from returning of the model
        body: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }
    type Comment {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }
    type Like {
        id: ID!
        username: String!
        createdAt: String!
    }
    type User {
        id: ID!
        username: String!
        email: String!
        token: String!
        createdAt: String!
    }
    input RegisterInput { # it is givin as an input since it will passed to the resolver 
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }
    # queries:
    type Query {
        getPosts: [Post] # giving the query a type & resolving it in resolvers (has no arguments)
        getPost(postId: ID): Post!
    }
    # mutations:
    type Mutation {
        register(registerInput: RegisterInput): User! # here we'll create a type input(RegisterInput) for the user's input that will be filled from the frontend and passed as a param in this mutation, the type here is User
        login(username: String!, password: String!): User! # here we simply passed the params without creating an input type
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }
    # subscriptions (used for listenings like in chatapps...)
    # type Subscription {
    #     newPost: Post! # to notify each time to whoever is subscriped, that a new post is created 
    # }
`