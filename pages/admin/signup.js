import Head from 'next/head';

import SignUpForm from '../../components/SignUpForm';
import styles from '../../styles/SignUp.module.css';

export default function SignUp() {
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
      <SignUpForm />
    </div>
  );
}
