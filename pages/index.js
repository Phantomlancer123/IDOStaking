import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';

import useWeb3 from '../hooks/useWeb3'
import { useIDOFactory } from '../hooks/useContract'
import { getAllIdos, getCounter } from '../hooks/common'
import { BannerItem } from '../components/BannerItem';
import { ConnectMetamask } from '../components/ConnectMetamask';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { IdoInfo } from '../components/IdoInfo';
import { IdoPool } from '../components/IdoPool';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [ethAddress, setEthAddress] = useState('');
  const [connectionText, setConnectionText] = useState('');

  const web3 = useWeb3()
  const IDOFactoryContract = useIDOFactory()

  const [idos, setIdos] = useState({
    live: [],
    upcoming: [],
    completed: [
    ]
  });
  const [banners, setBanners] = useState([]);
  const [selectedPool, setSelectedPool] = useState({});
  
  const getBanners = async () => {
    const url = '/api/banners';
    const response = await axios.get(url);
    setBanners(response.data);
  };
  
  useEffect(async () => {
    let counter = await getCounter(web3, IDOFactoryContract);
    let data = [];
    for (let i=0;i<parseInt(counter);i++){
      data.push(await getAllIdos(web3, IDOFactoryContract, i));
    }
    console.log(data, "------------")
    const getIdos = async () => {
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
      console.log(idoData)
      setIdos(idoData);
    };
    getIdos();
    getBanners();
  }, []);
  useEffect(async () => {
  }, [ethAddress]);
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
        ) : (Object.keys(selectedPool).length === 0 ? (
          <section className={styles.pools}>
            <div className={styles.banner}>
              <Carousel indicators={true}>
                {banners.map(banner => {
                  return <BannerItem item={banner} key={banner._id} />;
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
                        <IdoPool
                          key={pool.name}
                          pool={pool}
                          setSelectedPool={setSelectedPool}
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
                        <IdoPool
                          key={pool.name}
                          pool={pool}
                          setSelectedPool={setSelectedPool}
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
                        <IdoPool
                          key={pool.name}
                          pool={pool}
                          setSelectedPool={setSelectedPool}
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
