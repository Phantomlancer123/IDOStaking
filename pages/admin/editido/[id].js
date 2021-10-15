import axios from 'axios';
import Cookies from 'cookies';
import * as jwt from 'jsonwebtoken';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import EditIdoForm from '../../../components/EditIdoForm';
import styles from '../../../styles/SignIn.module.css';

export default function EditIdo({ requestedIdo }) {
  const [ido, setIdo] = useState(requestedIdo);
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
      <EditIdoForm ido={ido} />
    </div>
  );
}

// check if the user is logged in and get their account info from alpaca
export async function getServerSideProps({ req, res, query }) {
  const { id } = query;
  const cookies = new Cookies(req, res);
  const access_token = cookies.get('access_token');

  let isAuthenticated;
  try {
    isAuthenticated = jwt.verify(access_token, process.env.ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error(error);
  }

  const response = await axios({
    method: 'get',
    baseURL: process.env.NEXT_PUBLIC_FORWARDER_ORIGIN,
    url: `/api/idos/${id}`
  }).catch(error => console.error(error));
  if (!isAuthenticated) {
    res.writeHead(302, { location: '/' });
    res.end();
  } else {
    return {
      props: { requestedIdo: response.data } // will be passed to the page component as props
    };
  }
}
