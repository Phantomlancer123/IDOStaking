import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const WhitelistSchema = new Schema(
  {
    address: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

mongoose.models = {};

// check the model exists then use it, else create it.
const WhitelistModel = mongoose.model.Whitelist || mongoose.model('Whitelist', WhitelistSchema);

export default WhitelistModel;
