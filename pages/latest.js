import { makeStyles } from '@material-ui/core/styles';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import axios from 'axios';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { ConnectMetamask } from '../components/ConnectMetamask';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { MediumNewsItem } from '../components/MediumNewsItem';
import { TweetNewsItem } from '../components/TwitterNewsItem';
import styles from '../styles/Latest.module.css';

const useStyles = makeStyles(() => ({
  searchIcon: {
    verticalAlign: 'middle'
  }
}));

export default function Latest() {
  const classes = useStyles();
  const [ethAddress, setEthAddress] = useState('');
  const [connectionText, setConnectionText] = useState('');
  const [twitter, setTwitter] = useState([]);
  const [medium, setMedium] = useState([]);
  useEffect(() => {
    const getTweets = async () => {
      const { data } = await axios.get('/api/news/twitter');
      setTwitter(data);
    };
    const getMediumArticles = async () => {
      const { data } = await axios.get('/api/news/medium');
      setMedium(data);
    };
    getTweets();
    getMediumArticles();
  }, []);
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
          <div className={styles.rootContainer}>
            <h5>News & Announcements</h5>
            {/* <div className={styles.search}> */}
            {/*   <SearchOutlinedIcon className={classes.searchIcon} /> */}
            {/*   <input type="text" placeholder="Search with keyword" /> */}
            {/* </div> */}
            <div className={styles.newsItemsContainer}>
              {twitter.map(handle => (
                <TweetNewsItem key={handle.ido} handle={handle} />
              ))}
              {medium.map(newsItem => (
                <MediumNewsItem key={newsItem.ido} news={newsItem} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
