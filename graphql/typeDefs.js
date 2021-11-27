const gql = require('graphql-tag') // for writing graphql queries, mutations, schemas, subscription

module.exports = gql`
    # schemas:
    type Post {  
        id: ID! # filling the fields & their type
        body: String!
        createdAt: String!
        username: String!
    }
    # queries:
    type Query {
        getPosts: [Post] # giving the query a type & resolving it in resolvers (has no arguments)
    }
    # mutations:
    type Mutation {

    }
`