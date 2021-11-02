import React from 'react';

import styles from '../styles/IdoInfo.module.css';

export const IdoInfo = ({ pool, setSelectedPool }) => {
  const handleBackClick = e => {
    e.preventDefault();
    setSelectedPool({});
  };
  return (
    <div className={styles.idoContainer}>
      <button className={styles.backBtn} onClick={handleBackClick}>
        {'< '}Back
      </button>
      <a href={"https://rinkeby.etherscan.io/address/" + pool.address} target="_blank">
        <h4>
          <span>{pool.name}</span>
          {' Pool'}
        </h4>
      </a>
      <div className={styles.idoHeader}>
        <div className={styles.row}>
          <div className={`${styles.rowColumn} ${styles.left}`}>
            <div className={styles.idoLogo}>
              <img src={pool.logo} alt={`${pool.name} logo`} />
            </div>
            <div>
            <a href={"https://rinkeby.etherscan.io/address/" + pool.address} target="_blank">
                <h5 className={styles.idoName}>{pool.name}</h5>
              </a>
              <p className={styles.idoLinks}>
                <a href={pool.website} target="_blank" rel="noreferrer">
                  Website
                </a>
                {' | '}
                <a href={pool.twitter} target="_blank" rel="noreferrer">
                  Twitter
                </a>
                {' | '}
                <a href={pool.telegram} target="_blank" rel="noreferrer">
                  Telegram
                </a>
              </p>
            </div>
          </div>
          <div className={`${styles.rowColumn} ${styles.center}`}>
            {'Status: '}
            <span> &nbsp;{pool.status}</span>
          </div>
          <div className={styles.right}>
            <p>
              Your allocation: <span>0 {pool.symbol}</span>
            </p>
            <p>
              Remaining: <span>0 {pool.symbol}</span>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.idoBody}>
        <div className={styles.row}>
          <p>{pool.description}</p>
        </div>
        <p className={styles.idoStatus}>
          IDO Status:
          <span>{` ${pool.status} `}</span>
          Pair:
          <span>{` ${pool.pair}`}</span>
        </p>
        <div className={styles.progress}>
          <div
            className={styles.filler}
            style={{
              width: `${pool.progress}%`
            }}
          ></div>
        </div>
        <div className={`${styles.idoPadded} ${styles.row}`}>
          <span>{pool.progress}</span>
          <span className={styles.filledTotal}>181.81/181.82 ETH</span>
        </div>
        <div className={styles.row}>
          <div className={styles.idoInfo}>
            <div className={`${styles.infoHeader} ${styles.row}`}>
              Pool Information
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p>Registration Opens</p>
              <p>2021-07-21 15:00:00 UTC</p>
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p>Registration Closes</p>
              <p>2021-07-21 15:00:00 UTC</p>
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p>Whitelist Sale Opens</p>
              <p>2021-07-21 15:00:00 UTC</p>
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p>Whitelist Sale Closes</p>
              <p>2021-07-21 15:00:00 UTC</p>
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p>FCFS Sale Opens</p>
              <p>2021-07-29 15:00:00 UTC</p>
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p>Price</p>
              <p>1 ETH - 440000.00 {pool.symbol}</p>
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p>Pool Size</p>
              <p>80000000 {pool.symbol}</p>
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p>Vested Percentage</p>
              <p>30.00%</p>
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p># of vested tranches</p>
              <p>7</p>
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p>Tranche duration</p>
              <p>2592000 seconds</p>
            </div>
          </div>
          <div className={`${styles.idoInfo} ${styles.tokenInfo}`}>
            <div className={`${styles.infoHeader} ${styles.row}`}>
              Token Information
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p>Name</p>
              <p>{pool.name}</p>
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p>Token Symbol</p>
              <p>{pool.symbol}</p>
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p>Token Supply</p>
              <p>{pool.supply}</p>
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p>Decimals</p>
              <p>18</p>
            </div>
            <div className={`${styles.row} ${styles.infoRow}`}>
              <p>Address</p>
              <a href={"https://rinkeby.etherscan.io/address/" + pool.address} target="_blank">
                <p>{pool.address.substr(0, 6)}...</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
