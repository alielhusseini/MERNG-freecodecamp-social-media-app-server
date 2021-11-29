// imports
const express = require('express')
const { ApolloServer } = require('apollo-server') // to create the server, will not use the express
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

// setup
const app = express()
app.use(express.json())
app.use(cors())

/* quick recap:

    Schema: ObejctType, based on how you want the data to look like that's rooted from the model, and every field has a type, and maybe a resolve if there is any relation
    Query: (GET/READ) also has a type, might take arguments, and a resolve returning a model which the schema type is based on
    Mutation: (CRUD without the R) also has a type, takes arguments based on what action it will perform, and a resolve will return the mutated data according to the schema type

    const typeDefs = gql` // ! make it in a seperate folder (schemas, queries, mutations)
        # schemas:
        type Post {  
            id: ID! # filling the fields & their type
            body: String!
            createdAt: String!
            username: String!
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
            getPosts: [Post] # giving the query a type & resolving it in resolvers
        }
        # mutations:
        type Mutation {
            register(registerInput: RegisterInput): User! # here we'll create a type input(RegisterInput) for the user's input that will be filled from the frontend and passed as a param in this mutation, the type here is User
        }
    `
    const resolvers = { // ! make it in a seperate folder with index.js
        Query: {
            async getPosts() {
                try {
                    const post = await Post.find()
                    return post
                } catch(err) {
                    throw new Error({ where: 'index/resolver/getPosts' }, err)
                }
            }
        },
        Mutation: {
            async register(parent, args, context, info) {
                ...
                return User
            }
        }
    }
*/

const port = process.env.PORT || 5000
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }) // we're forwarding the req body to the context so that we can access the req (header especially) in the context parameter (this is used instead chaining the middleware to all routes upon requesting them. Now from the mutations we can access the req by context)
})

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true })
    .then(() => server.listen({ port }))
    .then(res => console.log(`server running at ${res.url}`))
    .catch(err => console.log('failed connecting to the database'))