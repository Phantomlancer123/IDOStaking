import React from 'react';

import styles from '../styles/TweetNewsItem.module.css';

export const TweetNewsItem = ({ handle }) => {
  return (
    <div className={styles.container}>
      {handle.tweets.map(tweet => (
        <div key={tweet.id} className={styles.newsItem}>
          <div>
            <div>
              <img src={handle.logo} alt={handle.name} />
            </div>
            <h3>{handle.ido}</h3>
          </div>
          <div>
            <p>{tweet.text}</p>
            <a
              href={`https://twitter.com/${handle.handle}/status/${tweet.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              link
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
