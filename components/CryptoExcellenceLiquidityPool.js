import React from 'react';

import styles from '../styles/CryptoExcellenceLiquidityPool.module.css';

export const CryptoExcellenceLiquidityPool = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={`/cefavicon.png`} alt="ce logo" />
        <h3>Purchase CE</h3>
      </div>
      <div className={styles.body}>
        <p>Purchase CE from Uniswap to participate in the LIFT IDOs.</p>
        <a
          href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x8f12dfc7981de79a8a34070a732471f2d335eece"
          target="swap"
        >
          <button>Purchase CE</button>
        </a>
      </div>
    </div>
  );
};
