import Head from 'next/head';

import SignInForm from '../../components/SignInForm';
import styles from '../../styles/SignIn.module.css';

export default function SignIn() {
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
      <SignInForm />
    </div>
  );
}
