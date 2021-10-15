import React from 'react';

import styles from '../styles/LiquidityPool.module.css';

export const LiquidityPool = ({ pair }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.images}>
          <img src={`/cefavicon.png`} alt="ce logo" />
          <img src={`/${pair.symbol}.png`} alt={`${pair.symbol} logo`} />
        </div>
        <h3>Add liquidity to CE-{pair.symbol.toUpperCase()}</h3>
      </div>
      <div className={styles.body}>
        <p>Get rewarded in CE and increase your chance of winning a ticket.</p>
        <a href={pair.swapLink} target="swap">
          <button>Add Liquidity</button>
        </a>
      </div>
    </div>
  );
};
