//define the schema
//query Schema is the defaul entry point for GraphQL (listing all the supported queries for the backend)
// IMPORTANT: add #graphql directive - makes it so that its recognized as GraphQL syntax
import {
  getPostById,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
} from '../services/posts.js'

//define schema i.e., queries that can be run
//! -> non-null modifier
export const querySchema = `#graphql
    type Query {
      test: String
      posts: [Post!]!
      postsByAuthor(username: String!): [Post!]!
      postsByTag(tag: String!): [Post!]!
      postById(id: ID!): Post
    }
    `
//define resolver to "return" a query based on the inquery
//  "resolve" the query to an output
//  "resolve" the query using the existing RestAPI backend
export const queryResolver = {
  Query: {
    test: () => {
      return 'Hello World from GraphQL!'
    },
    posts: async () => {
      return await listAllPosts()
    },
    postsByAuthor: async (parent, { username }) => {
      return await listPostsByAuthor(username)
    },
    postsByTag: async (parent, { tag }) => {
      return await listPostsByTag(tag)
    },
    postById: async (parent, { id }) => {
      return await getPostById(id)
    },
  },
}
