import { Blog } from './pages/Blog.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/login.jsx'

//import user data assets
import { useLoaderData } from 'react-router-dom'
import { getPosts, getPostById } from './api/posts.js'
import { getUserInfo } from './api/users.js'
import { ViewPost } from './pages/ViewPost.jsx'

import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'

export const routes = [
  {
    path: '/',
    loader: async () => {
      //instantiate a query client
      const queryClient = new QueryClient()

      //setup paramters
      const author = ''
      const sortBy = 'createdAt'
      const sortOrder = 'descending'
      //simulate the getPosts request
      const posts = await getPosts({ author, sortBy, sortOrder })

      //prefetch the query
      await queryClient.prefetchQuery({
        queryKey: ['posts', { author, sortBy, sortOrder }],
        queryFn: () => posts,
      })

      //set unique list of author id
      const uniqueAuthors = posts
        .map((post) => post.author)
        .filter((value, index, array) => array.indexOf(value) === index)
      // loop through the author's ids to get their names
      for (const userId of uniqueAuthors) {
        await queryClient.prefetchQuery({
          queryKey: ['users', userId],
          queryFn: () => getUserInfo(userId),
        })
      }
      return dehydrate(queryClient)
    }, //adjust the loader by placing the query-client inside it
    Component() {
      const dehydratedState = useLoaderData() //use the "loader" method above
      return (
        <HydrationBoundary state={dehydratedState}>
          <Blog />
        </HydrationBoundary>
      )
    },
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },

  {
    path: '/posts/:postId/:slug?',
    loader: async ({ params }) => {
      const postId = params.postId

      const queryClient = new QueryClient()

      const post = await getPostById(postId)
      await queryClient.prefetchQuery({
        queryKey: ['post', postId],
        queryFn: () => post,
      })

      if (post?.author) {
        await queryClient.prefetchQuery({
          queryKey: ['users', post.author],
          queryFn: () => getUserInfo(post.author),
        })
      }

      return { dehydratedState: dehydrate(queryClient), postId }
    },
    Component() {
      const { dehydratedState, postId } = useLoaderData()
      return (
        <HydrationBoundary state={dehydratedState}>
          <ViewPost postId={postId} />
        </HydrationBoundary>
      )
    },
  },
]
