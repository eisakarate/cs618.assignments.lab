import { gql } from '@apollo/client/core/index.js'

//define queries
export const GET_POSTS = gql`
  query getPosts {
    posts {
      author {
        username
      }
      id
      title
      contents
      tags
      updatedAt
      createdAt
    }
  }
`
