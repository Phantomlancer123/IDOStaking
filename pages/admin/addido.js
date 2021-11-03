import Cookies from 'cookies';
import * as jwt from 'jsonwebtoken';
import Head from 'next/head';

import AddIdoForm from '../../components/AddIdoForm';
import styles from '../../styles/SignIn.module.css';

export default function AddIdo({ user }) {
  return (
    <div>
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
      <AddIdoForm />
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

  if (!isAuthenticated) {
    res.writeHead(302, { location: '/' });
    res.end();
  } else {
    return {
      props: { user: isAuthenticated.user_id } // will be passed to the page component as props
    };
  }
}
