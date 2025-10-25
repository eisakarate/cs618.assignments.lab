import { PostList } from '../components/PostList.jsx'
import { CreatePost } from '../components/CreatePost.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'

//import graph ql
import { useQuery as useGraphQLQuery } from '@apollo/client/react/index.js'
import { GET_POSTS } from '../api/graphql/posts.js'

//for tab title update
import { Header } from '../components/Header.jsx'
import { Helmet } from 'react-helmet-async'

//create state to hold information on the client-side
import { useState } from 'react' //author filter, sorting, order

export function Blog() {
  //add states
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  const postsQuery = useGraphQLQuery(GET_POSTS)
  const posts = postsQuery.data?.posts ?? []

  return (
    <div style={{ padding: 8 }}>
      <Helmet>
        <title>Full Stack Pancake Blog</title>
        <meta
          name='description'
          content='A blog full of articles about full-stack React development.'
        />
      </Helmet>
      <Header />
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
