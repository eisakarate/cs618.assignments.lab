import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'

import { createUser } from '../services/users.js'

//create a user before everthing
let testUser = null
let samplePosts = []

beforeAll(async () => {
  testUser = await createUser({ username: 'Eevee', password: 'poTatoCheese' })

  //create sample post
  samplePosts = [
    { title: 'corgi dancing', author: testUser._id, tags: ['dance'] },
    { title: 'corgi eating more', author: testUser._id, tags: ['food'] },
    { title: 'TitleOnly', author: testUser._id },
    {
      title: 'BibioLtest',
      author: testUser._id,
      bibilography: ['book 1', 'book 2'],
    },
    { title: 'Learning Redux', author: testUser._id, tags: ['redux'] },
    { title: 'Learn React Hooks', author: testUser._id, tags: ['react'] },
    {
      title: 'Full-Stack React Projects',
      author: testUser._id,
      tags: ['react', 'nodejs'],
    },
  ]
})

//create tests
describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose Cats!',
      contents: 'This post is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    }
    // passing the testUser_id
    const createdPost = await createPost(testUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
    // we need to explicitly convert the id to a string, because it is an ObjectId object
    expect(String(foundPost.author?._id)).toMatch(String(testUser?._id))
  })

  test('without title should fail', async () => {
    const post = {
      contents: 'Post with no title',
      tags: ['empty'],
    }
    try {
      await createPost(testUser._id, post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })

  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Only a title',
    }
    const createdPost = await createPost(testUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

let createdSamplePosts = []

beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

//get test
describe('post retrieval tests', () => {
  test('should return all the items in the post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })

  test('should fail if the id does not exist in the database', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toEqual(null)
  })
})

//add tests to get posts
describe('listing post tests', () => {
  test('should return all posts in the database', async () => {
    const posts = await listAllPosts()
    console.log(posts.length)
    expect(posts.length).toEqual(createdSamplePosts.length)
  })

  test('should be able to filter posts by tag', async () => {
    const posts = await listPostsByTag('react')
    expect(posts.length).toBe(2)
  })

  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor(testUser.username)
    expect(posts.length).toBe(7)
  })
})

//Test create
describe('Testing creating posts', () => {
  //unit test: test to see if the adding was successful
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Corgi!',
      contents: 'Corgis are Potatos with feet.',
      tags: ['Awesome', 'Corgi'],
    }
    //create a post
    const createdPost = await createPost(testUser._id, post)
    //check to see if the Id is of the correct type
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
    //search by the id
    const foundPost = await Post.findById(createdPost._id)
    //check to to see if the found item has the same id
    expect(foundPost).toEqual(expect.objectContaining(post))
    //check to make sure that time stamps are dates
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })
})

describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'Test Update foo',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.contents).toEqual('Test Update foo')
  })

  test('should not update other properties', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'Test Update foo',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('corgi dancing')
  })

  test('should update the updatedAt timestamp', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'Test Update',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })

  test('should fail if the id does not exist', async () => {
    const post = await updatePost(testUser._id, '000000000000000000000000', {
      contents: 'Test Update',
    })
    expect(post).toEqual(null)
  })
})

describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(testUser._id, createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })

  test('should fail if the id does not exist', async () => {
    const result = await deletePost(testUser._id, '000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
