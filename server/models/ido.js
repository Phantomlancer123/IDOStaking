import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const IdoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    logo: {
      type: String,
      required: true
    },
    website: {
      type: String,
      required: true
    },
    twitter: {
      type: String
    },
    telegram: {
      type: String
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'UPCOMING', 'LIVE'],
      required: true
    },
    pair: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    progress: {
      type: Number,
      default: 0
    },
    swapRate: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    supply: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    poolCap: {
      type: String,
      required: true
    },
    medium: {
      type: String
    },
    track_news: {
      type: Boolean,
      default: false
    },
    access: {
      type: String,
      enum: ['PRIVATE', 'PUBLIC'],
      required: true
    },
    participants: {
      type: Number,
      default: 0
    },
    added_by: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    address: {
      type: String
    }
  },
  { timestamps: true }
);

mongoose.models = {};

const IdoModel = mongoose.model.Ido || mongoose.model('Ido', IdoSchema);

export default IdoModel;
