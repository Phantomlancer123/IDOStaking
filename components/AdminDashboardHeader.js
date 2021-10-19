import AddIcon from '@material-ui/icons/Add';
import MetaMaskOnboarding from '@metamask/onboarding';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from '../styles/AdminDashboardHeader.module.css';

export const AdminDashboardHeader = ({
  ethAddress,
  setEthAddress,
  setConnectionText
}) => {
  const [connectionPrompt, setConnectionPrompt] = useState('');
  const [metaMaskExists, setMetamaskExists] = useState(false);
  const router = useRouter();
  const handleAddIdoClick = () => {
    router.push('/admin/addido');
  };
  useEffect(() => {
    if (typeof window != 'undefined') {
      const { ethereum } = window;
      const metaMaskInstalled = Boolean(ethereum && ethereum.isMetaMask);
      if (!metaMaskInstalled) {
        setConnectionPrompt('Install metamask');
      }
      if (metaMaskInstalled) {
        setMetamaskExists(true);
        ethereum.request({ method: 'eth_accounts' }).then(accounts => {
          if (accounts.length > 0) {
            setEthAddress(accounts[0]);
          } else {
            setConnectionPrompt('Connect');
          }
        });
      }
    }
  }, [setEthAddress]);

  const handleConnectionClick = async e => {
    e.preventDefault();
    const forwarderOrigin = process.env.NEXT_PUBLIC_FORWARDER_ORIGIN;
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
    if (!metaMaskExists) {
      // if metamask is not installed this will run and the user will
      // be prompted to install metamask extension
      onboarding.startOnboarding();
    } else if (
      metaMaskExists && // if metamask is installed this will run and the user will
      // be prompted to connect their wallet
      typeof window !== 'undefined'
    ) {
      try {
        // Will open the MetaMask UI
        const { ethereum } = window;
        // request user to connect to ethereum
        await ethereum.request({ method: 'eth_requestAccounts' });
        // after connection take the first address in the accounts array and display it
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        setEthAddress(accounts[0]);
      } catch {
        setConnectionText("Couldn't connect to wallet, please try again.");
      }
    }
  };
  return (
    <header className={styles.container}>
      <div>
        <Link href="/admin/dashboard">
          <a>
            <img src="/logo.png" alt="logo" />
          </a>
        </Link>
        <nav>
          <ul>
            <li>
              <button
                onClick={handleConnectionClick}
                className={styles.connectButton}
              >
                {ethAddress !== ''
                  ? `${ethAddress.slice(1, 6)}...${ethAddress.slice(38)}`
                  : connectionPrompt}
              </button>
            </li>
            <li>
              <button onClick={handleAddIdoClick} className={styles.addIdo}>
                <AddIcon /> Add Ido
              </button>
            </li>
            <li>
              <Link href="/admin/banners">
                <a
                  className={
                    router.pathname === 'admin/editbanners' ? styles.active : ''
                  }
                >
                  Banners
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
