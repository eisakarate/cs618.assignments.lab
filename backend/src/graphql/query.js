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
//allow input types (allow specification of non-query content)
export const querySchema = `#graphql
    input PostsOptions {
    sortBy: String
    sortOrder: String
    }
    type Query {
      test: String
      posts(options: PostsOptions): [Post!]!
      postsByAuthor(username: String!, options: PostsOptions): [Post!]!
      postsByTag(tag: String!, options: PostsOptions): [Post!]!
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
    posts: async (parent, { options }) => {
      return await listAllPosts(options)
    },
    postsByAuthor: async (parent, { username, options }) => {
      return await listPostsByAuthor(username, options)
    },
    postsByTag: async (parent, { tag, options }) => {
      return await listPostsByTag(tag, options)
    },
    postById: async (parent, { id }) => {
      return await getPostById(id)
    },
  },
}
