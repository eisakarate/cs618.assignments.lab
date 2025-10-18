import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'

import { Helmet } from 'react-helmet-async'
import { Header } from '../components/Header.jsx'
import { Post } from '../components/Post.jsx'
import { getPostById } from '../api/posts.js'
import { getUserInfo } from '../api/users.js'
import { postTrackEvent } from '../api/events.js'

import { PostStats } from '../components/PostStats.jsx'

function truncate(str, max = 160) {
  if (!str) return str
  if (str.length > max) {
    return str.slice(0, max - 3) + '...'
  } else {
    return str
  }
}

export function ViewPost({ postId }) {
  //add session state
  const [session, setSession] = useState() //keep track when a user opens a page, this will start a interaction session

  //add a mutator, create new event on the backend w/ the postid and action, and session
  const trackEventMutation = useMutation({
    mutationFn: (action) => postTrackEvent({ postId, action, session }),
    onSuccess: (data) => setSession(data?.session),
  })

  //cause an effect
  useEffect(() => {
    let timeout = setTimeout(() => {
      trackEventMutation.mutate('startView') //start tracking an event, we'll set the action as "startView"
      timeout = null
    }, 1000) //after 1 second
    return () => {
      if (timeout) clearTimeout(timeout)
      else trackEventMutation.mutate('endView') //if a user leaves a page, end view
    }
  }, [])

  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  })
  const post = postQuery.data

  const userInfoQuery = useQuery({
    queryKey: ['users', post?.author],
    queryFn: () => getUserInfo(post?.author),
    enabled: Boolean(post?.author),
  })
  const userInfo = userInfoQuery.data ?? {}

  return (
    <div style={{ padding: 8 }}>
      {post && (
        <Helmet>
          <title>{post.title} | Full-Stack React Blog</title>
          <meta name='description' content={truncate(post.contents)} />
          <meta property='og:type' content='article' />
          <meta property='og:title' content={post.title} />
          <meta property='og:article:published_time' content={post.createdAt} />
          <meta property='og:article:modified_time' content={post.updatedAt} />
          <meta property='og:article:author' content={userInfo.username} />
          {(post.tags ?? []).map((tag) => (
            <meta key={tag} property='og:article:tag' content={tag} />
          ))}
        </Helmet>
      )}
      <Header />
      <br />
      <hr />
      <Link to='/'>Back to main page</Link>
      <br />
      <hr />
      {post ? (
        <div>
          <Post {...post} fullPost />
          <hr />
          <PostStats postId={postId} />
        </div>
      ) : (
        `Post with id ${postId} not found.`
      )}
    </div>
  )
}

ViewPost.propTypes = {
  postId: PropTypes.string.isRequired,
}
