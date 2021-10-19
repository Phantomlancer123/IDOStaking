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
        const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
        // get the users handle
        const twitterHandle = ido.twitter.split('com/')[1];
        const twitterUser = await twitterClient.v2.userByUsername(
          twitterHandle
        );
        const id = twitterUser.data.id;
        const tweets = await twitterClient.v2.userTimeline(id, {
          exclude: 'replies,retweets',
          max_results: 5
        });
        return {
          ido: ido.name,
          logo: ido.logo,
          handle: twitterHandle,
          tweets: tweets.data.data
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
