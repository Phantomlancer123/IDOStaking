import React from 'react';

import styles from '../styles/Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.container}>
      <div className={styles.items}>
        <div>
          <p>
            {' '}
            &copy; Copyright{' '}
            <strong>
              <span>Crypto Excellence.</span>
            </strong>
            {' All Rights Reserved'}
          </p>
        </div>
        <div className={styles.icons}>
          <a
            href="https://t.me/cryptoexcellencegroup"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/telegram.svg" alt="telegram" />
          </a>
          <a
            href="https://cryptoexcellence.medium.com/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/medium.svg" alt="medium" />
          </a>
          <a
            href="https://twitter.com/cryptoexcellenc"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/twitter.svg" alt="twitter" />
          </a>
          <a
            href="https://discord.gg/DDsYUHEWS9"
            target="_blank"
            rel="noreferrer"
          >
            <div>
              <img src="/discord.svg" alt="discord" />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
};
