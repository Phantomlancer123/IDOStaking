import { makeStyles } from '@material-ui/core/styles';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import Head from 'next/head';
import { useState } from 'react';
import React from 'react';

import { ConnectMetamask } from '../components/ConnectMetamask';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import styles from '../styles/Dashboard.module.css';

const useStyles = makeStyles(() => ({
  searchIcon: {
    verticalAlign: 'middle'
  }
}));

export default function Dashboard() {
  const classes = useStyles();
  const [ethAddress, setEthAddress] = useState('');
  const [connectionText, setConnectionText] = useState('');
  const [joinedIdos, setJoinedIdos] = useState([]);
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
          <div className={styles.dashboardContainer}>
            <h5>IDOs Joined</h5>
            <div className={styles.search}>
              <SearchOutlinedIcon className={classes.searchIcon} />
              <input type="text" placeholder="Search by IDO name" />
            </div>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr
                    style={{
                      borderBottom:
                        joinedIdos.length > 0 ? '1px solid #018a44' : 'none'
                    }}
                  >
                    <th>Pool Name</th>
                    <th>Price</th>
                    <th>Access</th>
                    <th>Progress</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {joinedIdos.map(ido => (
                    <tr key={ido.name}>
                      <td>{ido.name}</td>
                      <td>{ido.price}</td>
                      <td>{ido.access}</td>
                      <td>{ido.progress}</td>
                      <td>{ido.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
