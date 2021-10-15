import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import databaseConnect from '../../../server/databaseConnect';
import UserModel from '../../../server/models/user';

export default async function handler(req, res) {
  const { body, method } = req;

  if (method === 'POST') {
    try {
      const { refresh_token } = body;
      if (!refresh_token) {
        return res.status(400).json({ message: 'refresh_token is required' });
      }
      await databaseConnect();
      let decoded;
      try {
        decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_KEY);
      } catch (error) {
        return error instanceof jwt.TokenExpiredError
          ? res.status(401).json({ message: 'Your refresh token has expired' })
          : res.status(401).json({ message: 'Invalid refresh token' });
      }
      const user = await UserModel.findById(decoded.user_id);
      // if the sent refresh token belongs to the user generate new api keys
      // else the refresh token is treated as invalid
      if (user && (await bcrypt.compare(refresh_token, user.refresh_token))) {
        // generate new api keys for the user
        const access_token = jwt.sign(
          { user_id: user._id },
          process.env.ACCESS_TOKEN_KEY,
          {
            expiresIn: '2h'
          }
        );
        const refresh_token = jwt.sign(
          { user_id: user._id },
          process.env.REFRESH_TOKEN_KEY,
          {
            expiresIn: '1d'
          }
        );
        await UserModel.findOneAndUpdate(
          { _id: user._id },
          {
            refresh_token: await bcrypt.hash(refresh_token, 10)
          },
          { new: true, runValidators: true }
        );
        return res.status(200).json({
          access_token,
          refresh_token
        });
      }
      return res.status(401).json({
        message: 'Invalid refresh token'
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    return res.status(422).json({ message: `Method ${method} not allowed` });
  }
}
