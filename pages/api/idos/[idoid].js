import * as jwt from 'jsonwebtoken';

import databaseConnect from '../../../server/databaseConnect';
import IdoModel from '../../../server/models/ido';
import UserModel from '../../../server/models/user';

export default async function handler(req, res) {
  const { body, method, headers, query } = req;

  const { idoid } = query;
  const internalServerError = 'Something went wrong';
  try {
    await databaseConnect();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: internalServerError });
  }
  switch (method) {
    case 'GET':
      try {
        const ido = await IdoModel.findOne({
          _id: idoid
        });
        return res.status(200).json(ido);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(500).json({ message: internalServerError });
      }
    case 'DELETE':
      if (!headers.authorization) {
        return res.status(401).json({
          message: 'Access token is required for authentication'
        });
      }
      try {
        const authValue = headers.authorization;
        const token = authValue.replace('Bearer ', '');
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      } catch (error) {
        return error instanceof jwt.TokenExpiredError
          ? res.status(401).json({ message: 'Your access token has expired' })
          : res.status(401).json({ message: 'Invalid access token' });
      }
      try {
        await IdoModel.deleteOne({
          _id: idoid
        });
        return res.status(204).send();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(500).json({ message: internalServerError });
      }
    case 'POST': {
      const {
        status
      } = body;
      if (!headers.authorization) {
        return res.status(401).json({
          message: 'Access token is required for authentication'
        });
      }
      try {
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
        // only admins can update idos
        const user = await UserModel.findById(decoded.user_id);
        if (user.role !== 'admin') {
          return res.status(403).json({
            message: 'Forbidden'
          });
        }
        const updated = await IdoModel.findOneAndUpdate(
          {
            _id: idoid
          },
          {status: status},
          { new: true, runValidators: true }
        );
        return res.status(200).json(updated);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: internalServerError });
      }
    }
    default:
      res.status(400).json({ message: `Method ${method} not allowed` });
  }
}
