import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'

//Services/post.js performs the CRUD operations
export async function createPost(
  userId,
  {
    title,
    //author, replaced by user-id
    contents,
    tags,
  },
) {
  console.log(`userId: ${userId}`)
  //set the author to the object
  const post = new Post({
    title,
    author: userId,
    contents,
    tags,
  })
  return await post.save()
}

//list the posts
export async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}

//list ALL the posts
export async function listAllPosts(options) {
  return await listPosts({}, options)
}

//list posts based on an Author
export async function listPostsByAuthor(authorUserName, options) {
  const user = await User.findOne({ username: authorUserName })

  //find a match?
  if (!user) return []

  return await listPosts({ author: user._id }, options)
}

//list posts by Tab
export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}

//get post by an Id
export async function getPostById(postId) {
  return await Post.findById(postId) //using Mongoose
}

//update a post
export async function updatePost(userId, postId, { title, contents, tags }) {
  return await Post.findOneAndUpdate(
    { _id: postId, author: userId }, //find the post by PostId and UserId
    {
      $set: { title, contents, tags },
    },
    { new: true },
  )
}

//delete a post
export async function deletePost(userId, postId) {
  return await Post.deleteOne({ _id: postId, author: userId }) //post and userid must match
}
