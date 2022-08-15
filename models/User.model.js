const { Schema, model } = require("mongoose")

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
    },
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER', 'PREMIUM'],
      default: 'USER'
    },
    favorites: {
      type: [String],
      unique: true
    },
  },
  {
    timestamps: true,
  }
)

const User = model("User", userSchema)

module.exports = User