import Head from 'next/head';
import React, { useState } from 'react';

import { ConnectMetamask } from '../components/ConnectMetamask';
import { CryptoExcellenceLiquidityPool } from '../components/CryptoExcellenceLiquidityPool';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { LiquidityPool } from '../components/LiquidityPool';
import styles from '../styles/Liquidity.module.css';

export default function Liquidity() {
  const [ethAddress, setEthAddress] = useState('');
  const [connectionText, setConnectionText] = useState('');
  const pairs = [
    {
      symbol: 'eth',
      swapLink:
        'https://app.uniswap.org/#/add/v2/ETH/0x8f12dfc7981de79a8a34070a732471f2d335eece'
    },
    {
      symbol: 'usdt',
      swapLink:
        'https://app.uniswap.org/#/add/v2/0xdac17f958d2ee523a2206206994597c13d831ec7/0x8f12dfc7981de79a8a34070a732471f2d335eece'
    }
  ];
  return (
    <div className={styles.container}>
      <Head>
        <title>Crypto Excellence</title>
        <meta name="description" content="Crypto Excellence" />
        <link rel="icon" href="/cefavicon.png" />
      </Head>
      <video
        playsInline
        autoPlay
        muted
        loop
        id="bgvid"
        className={styles.video}
      >
        <source src="/bgvideo.mp4" type="video/mp4" />
      </video>
      <Header
        ethAddress={ethAddress}
        setEthAddress={setEthAddress}
        setConnectionText={setConnectionText}
      />
      <main className={styles.main}>
        {ethAddress === '' ? (
          <section className={styles.wrapper}>
            <ConnectMetamask
              ethAddress={ethAddress}
              setEthAddress={setEthAddress}
              connectionText={connectionText}
              setConnectionText={setConnectionText}
            />
          </section>
        ) : (
          <div className={styles.poolsContainer}>
            <div className={styles.pools}>
              {pairs.map(pair => (
                <LiquidityPool key={pair} pair={pair} />
              ))}
              <CryptoExcellenceLiquidityPool />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
