import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import databaseConnect from '../../../server/databaseConnect';
import UserModel from '../../../server/models/user';

export default async function handler(req, res) {
  const { body, method } = req;
  if (method === 'POST') {
    try {
      await databaseConnect();
      let { email, password } = body;

      let user = await UserModel.findOne({
        email
      });
      if (user) {
        return res.status(409).json({
          message: 'User already exists'
        });
      }
      password = await bcrypt.hash(password, 10);
      user = await UserModel.create({
        email,
        password
      });
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
      user = await UserModel.findOneAndUpdate(
        { email },
        {
          refresh_token: await bcrypt.hash(refresh_token, 10)
        },
        { new: true, runValidators: true }
      )
        .select('-__v')
        .lean();
      user.access_token = access_token;
      user.refresh_token = refresh_token;
      return res.status(200).json(user);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    return res.status(422).json({ message: `Method ${method} not allowed` });
  }
}
