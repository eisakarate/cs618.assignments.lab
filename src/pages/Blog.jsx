import { PostList } from '../components/PostList.jsx'
import { CreatePost } from '../components/CreatePost.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'

import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../api/posts.js'

//for tab title update
import { Helmet } from 'react-helmet-async'

//create state to hold information on the client-side
import { useState } from 'react' //author filter, sorting, order

export function Blog() {
  //add states
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  //define a query
  const postQuery = useQuery({
    queryKey: ['posts', { author, sortBy, sortOrder }],
    queryFn: () => getPosts({ author, sortBy, sortOrder }),
  })

  //get data
  const posts = postQuery.data ?? [] //get the result

  return (
    <div style={{ padding: 8 }}>
      <Helmet>
        <title>Full Stack Pancake Blog</title>
        <meta
          name='description'
          content='A blog full of articles about full-stack React development.'
        />
      </Helmet>
      <CreatePost />
      <br />
      <hr />
      Filter by:
      {/* set the value to the current state (author) and set the onChange event to set the author value*/}
      <PostFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <PostSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      {/* post list */}
      <PostList posts={posts} />
    </div>
  )
}
