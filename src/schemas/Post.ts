import { Schema, model, Document } from 'mongoose'
import { IPost } from '../models/Post'

const PostSchema = new Schema(
  {
    title: String,
    description: String,
    photoUrl: String
  },
  {
    timestamps: true
  }
)

export default model<IPost & Document>('Post', PostSchema)
