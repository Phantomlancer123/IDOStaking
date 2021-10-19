const cloudinary = require('cloudinary').v2;
import formidable from 'formidable';
import * as jwt from 'jsonwebtoken';

import databaseConnect from '../../server/databaseConnect';
import BannerModel from '../../server/models/banner';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async (req, res) => {
  const { body, headers, method, query } = req;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const internalServerError = 'Something went wrong';
  try {
    await databaseConnect();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: internalServerError });
  }

  switch (method) {
    case 'POST':
      try {
        if (!headers.authorization) {
          return res.status(401).json({
            message: 'Access token is required for authentication'
          });
        }
        let decoded;
        const authValue = headers.authorization;
        const token = authValue.replace('Bearer ', '');
        try {
          decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        } catch (error) {
          return error instanceof jwt.TokenExpiredError
            ? res.status(401).json({ message: 'Your access token has expired' })
            : res.status(401).json({ message: 'Invalid access token' });
        }
        const form = new formidable.IncomingForm();

        form.keepExtensions = true;
        form.parse(req, async (err, fields, file) => {
          try {
            const result = await cloudinary.uploader.upload(file.banner.path, {
              folder: 'banners'
            });
            const banner = await BannerModel.create({
              filename: result.public_id,
              path: result.url,
              added_by: decoded.user_id
            });
            return res.status(201).send({ banner });
          } catch {
            return res.status(500).json({ message: internalServerError });
          }
        });
      } catch {
        return res.status(500).json({ message: 'Something went wrong' });
      }
      break;
    case 'GET':
      try {
        const banners = await BannerModel.find({}).select('-added_by');
        return res.status(200).json(banners);
      } catch {
        return res.status(500).json({ message: internalServerError });
      }
    case 'DELETE':
      try {
        if (!headers.authorization) {
          return res.status(401).json({
            message: 'Access token is required for authentication'
          });
        }
        const authValue = headers.authorization;
        const token = authValue.replace('Bearer ', '');
        try {
          jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        } catch (error) {
          return error instanceof jwt.TokenExpiredError
            ? res.status(401).json({ message: 'Your access token has expired' })
            : res.status(401).json({ message: 'Invalid access token' });
        }
        const { id } = query;
        const banner = await BannerModel.findById(id);
        if (!banner) {
          return res.status(404).json({ message: 'Banner not found' });
        }
        await cloudinary.uploader.destroy(banner.filename);
        await BannerModel.deleteOne({
          _id: id
        });
        return res.status(204).send();
      } catch {
        return res.status(500).json({ message: internalServerError });
      }
    default: {
      res.status(400).json({ message: `Method ${method} not allowed` });
    }
  }
};
