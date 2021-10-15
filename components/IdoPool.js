import React from 'react';

import styles from '../styles/IdoPool.module.css';

export const IdoPool = ({ pool, setSelectedPool }) => {
  const handlePoolClick = e => {
    e.preventDefault();
    setSelectedPool(pool);
  };
  return (
    <div className={styles.container}>
      <div className={styles.idoPool}>
        <div className={styles.idoHeader}>
          <div className={styles.idoLogo}>
            <img src={pool.logo} alt={`${pool.name} logo`} />
          </div>
          <div className={styles.idoInfo}>
            <h5>{pool.name}</h5>
            <p>
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
        <div
          className={styles.idoBody}
          onClick={handlePoolClick}
          role="button"
          tabIndex={0}
          onKeyDown={handlePoolClick}
        >
          <p className={styles.idoStatus}>
            {' '}
            IDO Status: <span>{pool.status}</span> Pair:{' '}
            <span>{pool.pair}</span>
          </p>
          <p className={styles.idoDescription}>{pool.description}</p>
          <h5 className={styles.idoBodyHeader}>IDO Progress</h5>
          <div className={styles.progress}>
            <div
              className={styles.filler}
              style={{
                width: `${pool.progress}%`
              }}
            ></div>
          </div>
          <div className={styles.idoPercentage}>{pool.idoProgress}</div>
          <div className={styles.idoBottom}>
            <p className={styles.idoBottomSwap}>
              Price - 1 ETH:{' '}
              <span
                className={styles.idoPrice}
              >{`${pool.price} ${pool.symbol}`}</span>
            </p>
            <p className={styles.idoBottomCap}>
              Pool Cap -{' '}
              <span
                className={styles.idoSize}
              >{`${pool.poolCap} ${pool.symbol}`}</span>
            </p>
            <p className={styles.idoBottomAccess}>Access - Private</p>
            <p className={styles.idoBottomParticipants}>
              Participants - <span>{pool.participants}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
