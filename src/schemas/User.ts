import { Schema, model, Document } from 'mongoose'
import { IUser } from '../models/User'
import bcrypt from 'bcryptjs'

const UserSchema = new Schema(
  {
    email: { type: String, unique: true },
    name: String,
    photoUrl: String,
    password: { type: String, select: false }
  },
  {
    timestamps: true
  }
)

UserSchema.pre<IUser & Document>('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})

export default model<IUser & Document>('User', UserSchema)
