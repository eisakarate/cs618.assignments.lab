//define the query for export
import { querySchema, queryResolver } from './query.js'
import { postSchema, postResolver } from './post.js'
import { userSchema, userResolver } from './user.js'

export const typeDefs = [querySchema, postSchema, userSchema]
export const resolvers = [queryResolver, postResolver, userResolver]
