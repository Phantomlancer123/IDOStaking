import * as jwt from 'jsonwebtoken';

import databaseConnect from '../../server/databaseConnect';
import WhitelistModel from '../../server/models/whitelist';

export default async function handler(req, res) {
  const { body, method, headers } = req;

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
        await WhitelistModel.deleteMany({});
        const newAddress = await WhitelistModel.create({
          address: body
        });
        return res.status(201).send(newAddress);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(500).json({ message: internalServerError });
      }
    case 'GET': {
      try {
        const whitelist = await WhitelistModel.find({});
        return res.status(200).json(whitelist);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(500).json({ message: internalServerError });
      }
    }
    default: {
      res.status(400).json({ message: `Method ${method} not allowed` });
    }
  }
}
