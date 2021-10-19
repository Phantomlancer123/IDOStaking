import React from 'react';

import styles from '../styles/MediumNewsItem.module.css';

export const MediumNewsItem = ({ news }) => {
  return (
    <div>
      {news.articles.map(article => (
        <div key={article.title} className={styles.newsItem}>
          <div>
            <div>
              <img src={news.logo} alt={article.title} />
            </div>
            <h3>{article.title}</h3>
          </div>
          <div>
            <p>{article.description}</p>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              link
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
