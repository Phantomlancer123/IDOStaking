import axios from 'axios';
import Cookies from 'cookies';
import * as jwt from 'jsonwebtoken';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';

import { AdminDashboardHeader } from '../../components/AdminDashboardHeader';
import { AdminIdoPool } from '../../components/AdminIdoPool';
import { BannerItem } from '../../components/BannerItem';
import { ConnectMetamask } from '../../components/ConnectMetamask';
import { Footer } from '../../components/Footer';
import { IdoInfo } from '../../components/IdoInfo';
import styles from '../../styles/AdminDashboard.module.css';

export default function AdminDashboard({ idoData }) {
  const [ethAddress, setEthAddress] = useState('');
  const [connectionText, setConnectionText] = useState('');
  const [idos, setIdos] = useState(idoData);
  const [selectedPool, setSelectedPool] = useState({});

  const [banners, setBanners] = useState([]);

  const getBanners = async () => {
    const url = '/api/banners';
    const response = await axios.get(url);
    setBanners(response.data);
  };

  useEffect(() => {
    getBanners();
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
      <AdminDashboardHeader
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
        ) : (Object.keys(selectedPool).length === 0 ? (
          <section className={styles.pools}>
            <div className={styles.banner}>
              <Carousel indicators={true}>
                {banners.map(banner => {
                  return <BannerItem item={banner} key={banner.path} />;
                })}
              </Carousel>
            </div>
            <h4>Live IDOs</h4>
            <div className={styles.liveIdos}>
              <div className={styles.container}>
                <div className={idos.live.length > 0 ? styles.row : undefined}>
                  {idos.live.length === 0 ? (
                    <p className={styles.noIdoText}>There are no live IDOs</p>
                  ) : (
                    idos.live.map(pool => {
                      return (
                        <AdminIdoPool
                          key={pool.name}
                          pool={pool}
                          setSelectedPool={setSelectedPool}
                          setIdos={setIdos}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>
            <h4>Upcoming IDOs</h4>
            <div className={styles.upComingIdos}>
              <div className={styles.container}>
                <div
                  className={idos.upcoming.length > 0 ? styles.row : undefined}
                >
                  {idos.upcoming.length === 0 ? (
                    <p className={styles.noIdoText}>
                      There are no upcoming IDOs
                    </p>
                  ) : (
                    idos.upcoming.map(pool => {
                      return (
                        <AdminIdoPool
                          key={pool.name}
                          pool={pool}
                          setSelectedPool={setSelectedPool}
                          setIdos={setIdos}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>
            <h4>Completed IDOs</h4>
            <div className={styles.completedIdos}>
              <div className={styles.container}>
                <div
                  className={idos.completed.length > 0 ? styles.row : undefined}
                >
                  {idos.completed.length === 0 ? (
                    <p className={styles.noIdoText}>
                      There are no completed IDOs
                    </p>
                  ) : (
                    idos.completed.map(pool => {
                      return (
                        <AdminIdoPool
                          key={pool.name}
                          pool={pool}
                          setSelectedPool={setSelectedPool}
                          setIdos={setIdos}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className={styles.ido}>
            <IdoInfo pool={selectedPool} setSelectedPool={setSelectedPool} />
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}

// check if the user is logged in and get their account info from alpaca
export async function getServerSideProps({ req, res }) {
  const cookies = new Cookies(req, res);
  const access_token = cookies.get('access_token');

  let isAuthenticated;
  try {
    isAuthenticated = jwt.verify(access_token, process.env.ACCESS_TOKEN_KEY);
  } catch (error) {
    console.log(error);
  }

  if (isAuthenticated) {
    const response = await axios({
      method: 'get',
      url: `${process.env.NEXT_PUBLIC_FORWARDER_ORIGIN}/api/idos`
    });
    const idoData = {
      live: [],
      upcoming: [],
      completed: []
    };
    for (const ido of response.data) {
      if (ido.status === 'LIVE') {
        idoData.live.push(ido);
      } else if (ido.status === 'UPCOMING') {
        idoData.upcoming.push(ido);
      } else {
        idoData.completed.push(ido);
      }
    }
    return {
      props: { idoData } // will be passed to the page component as props
    };
  } else {
    res.writeHead(302, { location: '/' });
    res.end();
  }
}
