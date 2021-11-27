// imports
const express = require('express')
const { ApolloServer } = require('apollo-server') // to create the server, will not use the express
const gql = require('graphql-tag') // for writing graphql queries, mutations, schemas, subscription
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')
const User = require('./models/User')
const Post = require('./models/Post')

// setup
const app = express()
app.use(express.json())
app.use(cors())

const typeDefs = gql`
    # schemas:
    type Post {  
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }
    # queries:
    type Query {
        getPosts: [Post]
    }
`
const resolvers = {
    Query: {
        async getPosts() {
            try {
                const post = await Post.find()
                return post
            } catch(err) {
                throw new Error('index/resolver/getPosts', err)
            }
        }
    }
}

const port = process.env.PORT || 5000
const server = new ApolloServer({
    typeDefs,
    resolvers
})

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true })
    .then(() => server.listen({ port }))
    .then(res => console.log(`server running at ${res.url}`))
    .catch(err => console.log('failed connecting to the database'))
