import mongoose, { Schema } from 'mongoose'
const eventsSchema = new Schema(
  {
    //post to keep track of
    post: { type: Schema.Types.ObjectId, ref: 'post', required: true },

    //unique id the session (user, identity)
    session: { type: String, required: true },

    //action they took (viewing a post, going away from a post, viewing a home page)
    action: { type: String, required: true },

    //time stamp of the action
    date: { type: Date, required: true },
  },
  //built in timestamp
  { timestamps: true },
)

export const Event = mongoose.model('events', eventsSchema)
