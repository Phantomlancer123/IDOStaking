import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BannerSchema = new Schema(
  {
    filename: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    added_by: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

mongoose.models = {};

const BannerModel =
  mongoose.model.Banner || mongoose.model('Banner', BannerSchema);

export default BannerModel;
