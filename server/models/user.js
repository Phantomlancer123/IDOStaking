import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'unapproved'
    },
    refresh_token: {
      type: String
    }
  },
  { timestamps: true }
);

mongoose.models = {};

// check the model exists then use it, else create it.
const UserModel = mongoose.model.User || mongoose.model('User', UserSchema);

export default UserModel;
