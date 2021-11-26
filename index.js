// imports
const express = require('express')
const { ApolloServer } = require('apollo-server') // to create the server, will not use the express
const gql = require('graphql-tag')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')

// setup
const app = express()
app.use(express.json())
app.use(cors())

const typeDefs = gql`
    type Query{
        sayHi: String!
    }
`
const resolvers = {
    Query: {
        sayHi: () => 'hello world'
    }
}

const port = process.env.PORT || 5000
const server = new ApolloServer({
    typeDefs,
    resolvers
})
server.listen({ port })
    .then(res => console.log(`server running at ${res.url}`))
