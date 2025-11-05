import { useState } from 'react'

import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { User } from './User.jsx'

import { Link } from 'react-router-dom'
import slug from 'slug' //needed for links

import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import {
  CREATE_POST,
  GET_POSTS,
  GET_POSTS_BY_AUTHOR,
} from '../api/graphql/posts.js'

// how to call the Post API?
//use a mutation (useMutation)

export function CreatePost() {
  //define authentication state
  const [token] = useAuth() //get the token, if its there

  //define states
  const [title, setTitle] = useState('') //setTitle is an "alias" to "function" that set the state value for title
  //const [author, setAuthor] = useState('')  //we are going to use the Token
  const [contents, setContents] = useState('')

  const [createPost, { loading, data }] = useGraphQLMutation(CREATE_POST, {
    variables: { title, contents },
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [GET_POSTS, GET_POSTS_BY_AUTHOR], //refetch after storing
  })

  //define a function to submit
  const handleSubmit = (e) => {
    //prevent full postback, so that push happens in the way we want it to
    e.preventDefault()

    //push to the database
    createPost()
  }

  //check for authentication
  if (!token) return <div>Please log in to create new posts.</div>

  const { sub } = jwtDecode(token) //get the user-id, then nullify the token, then stay on the page
  //prevent
  return (
    <form onSubmit={handleSubmit}>
      {/* {e}=>e.preventDefault(), makes it so that page doesn't refresh on click on the submission control */}
      <div>
        <label htmlFor='create-title'>Title: </label>
        {/* add a field for entering a title */}
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-author'>Author: </label> <User id={sub} />
      </div>
      <br />
      <label htmlFor='blog-content'>Blog Content: </label>
      {/* add a field for entering a content? */}
      <textarea
        name='blog-content'
        id='blog-content'
        value={contents}
        onChange={(e) => setContents(e.target.value)}
      />
      <br />
      <br />
      {/* disable when there is no title */}
      {/* Display correct button text correctly */}
      <input
        type='submit'
        value={loading ? 'Creating...' : 'Create'}
        disabled={!title || loading}
      />
      {/* display a status message */}
      {data?.createPost ? (
        <>
          <br />
          Post{' '}
          <Link
            to={`/posts/${data.createPost.id}/${slug(data.createPost.title)}`}
          >
            {data.createPost.title}
          </Link>{' '}
          created successfully!
        </>
      ) : null}
    </form>
  )
}
