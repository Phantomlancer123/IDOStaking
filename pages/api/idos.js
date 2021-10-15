import * as jwt from 'jsonwebtoken';

import databaseConnect from '../../server/databaseConnect';
import IdoModel from '../../server/models/ido';
import UserModel from '../../server/models/user';

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
        let {
          name,
          logo,
          website,
          twitter,
          telegram,
          progress,
          status,
          pair,
          description,
          swapRate,
          symbol,
          supply,
          price,
          poolCap,
          access,
          participants
        } = body;
        // only admins can post idos
        const user = await UserModel.findById(decoded.user_id);
        if (user.role !== 'admin') {
          return res.status(403).json({
            message: 'Forbidden'
          });
        }
        const newIdo = await IdoModel.create({
          name,
          logo,
          website,
          twitter,
          telegram,
          status,
          pair,
          description,
          progress: progress || 0,
          swapRate,
          symbol,
          supply,
          price,
          poolCap,
          access,
          participants,
          added_by: decoded.user_id
        });
        return res.status(201).send(newIdo);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(500).json({ message: internalServerError });
      }
    case 'PUT': {
      const {
        name,
        logo,
        website,
        twitter,
        telegram,
        status,
        pair,
        description,
        progress,
        swapRate,
        symbol,
        supply,
        price,
        poolCap,
        access,
        participants
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
        const ido = await IdoModel.findOne({
          name
        });
        if (!ido) {
          return res.status(404).json({
            message: 'Ido not found'
          });
        }
        const update = {
          logo,
          website,
          twitter,
          telegram,
          status,
          pair,
          description,
          progress,
          swapRate,
          symbol,
          supply,
          price,
          poolCap,
          access,
          participants
        };

        // eslint-disable-next-line unicorn/no-array-reduce
        const updateObject = Object.keys(update).reduce((accumulator, key) => {
          const _accumulator = accumulator;
          if (update[key] !== undefined || '') {
            _accumulator[key] = update[key];
          }
          return _accumulator;
        }, {});
        const updated = await IdoModel.findOneAndUpdate(
          {
            name
          },
          updateObject,
          { new: true, runValidators: true }
        );
        return res.status(200).json(updated);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(500).json({ message: internalServerError });
      }
    }
    case 'GET': {
      try {
        const idos = await IdoModel.find({});
        return res.status(200).json(idos);
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
