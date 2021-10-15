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

      if (user && (await bcrypt.compare(password, user.password))) {
        if (user.role !== 'unapproved') {
          // generate api keys for the user
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
          // update the user's data with the new hashed refresh_token
          user = await UserModel.findOneAndUpdate(
            { email },
            {
              refresh_token: await bcrypt.hash(refresh_token, 10)
            },
            { new: true, runValidators: true }
          ).lean();
          user.access_token = access_token;
          user.refresh_token = refresh_token;
          return res.status(200).json(user);
        }
        return res
          .status(401)
          .json({ message: 'Your account is pending approval' });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    return res.status(422).json({ message: `Method ${method} not allowed` });
  }
}
