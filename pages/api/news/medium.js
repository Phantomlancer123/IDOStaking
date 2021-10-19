import axios from 'axios';
import TwitterApi from 'twitter-api-v2';

import databaseConnect from '../../../server/databaseConnect';
import IdoModel from '../../../server/models/ido';

export default async function handler(req, res) {
  const internalServerError = 'Something went wrong';
  try {
    await databaseConnect();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: internalServerError });
  }
  try {
    const idos = await IdoModel.find({
      track_news: true
    });
    const news = await Promise.all(
      idos.map(async ido => {
        let medium;
        if (ido.medium) {
          // get latest medium blogs from this api https://github.com/david-fernando/medium-posts-api
          const mediumUsername = ido.medium.split('com/')[1];
          const { data } = await axios.get(
            `https://mediumpostsapi.herokuapp.com/?usermedium=${mediumUsername}`
          );
          medium = data.dataMedium;
        }
        return {
          ido: ido.name,
          logo: ido.logo,
          articles: medium || []
        };
      })
    );
    return res.status(200).json(news);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: internalServerError });
  }
}
