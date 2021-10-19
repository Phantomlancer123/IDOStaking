import MetaMaskOnboarding from '@metamask/onboarding';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import getRpcUrl from '../hooks/getRpcUrl'

import styles from '../styles/Header.module.css';

export const Header = ({ ethAddress, setEthAddress, setConnectionText }) => {
  const [connectionPrompt, setConnectionPrompt] = useState('Connect');
  const [metaMaskExists, setMetamaskExists] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window != 'undefined') {
      const { ethereum } = window;
      const getAccount = async () => {
        try {
          await ethereum.request({ method: 'eth_requestAccounts' });
          ethereum.request({ method: 'eth_accounts' }).then(accounts => {
            if (accounts.length > 0) {
              setEthAddress(accounts[0]);
            } else {
              setConnectionPrompt('Connect');
            }
          });
        } catch {
          setEthAddress('');
          setConnectionPrompt('Connect');
        }
      };
      const metaMaskInstalled = Boolean(ethereum && ethereum.isMetaMask);
      if (!metaMaskInstalled) {
        setConnectionPrompt('Install metamask');
      }
      if (metaMaskInstalled) {
        setMetamaskExists(true);
        // check if the user's current chain is ethereum
        if (ethereum.chainId === '0x4') {
          // get the user's wallet address
          getAccount();
        } else {
          // request the user to change to the ethereum network
          const changeNetwork = async () => {
            try {
              await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x4' }]
              });
              // get the user's wallet address
              getAccount();
            } catch (switchError) {
              // This error code indicates that the chain has not been added to MetaMask.
              if (switchError.code === 4902) {
                try {
                  await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: '0x4',
                        rpcUrl: getRpcUrl()
                      }
                    ]
                  });
                  getAccount();
                } catch {
                  // if there is an error we just ask the user to try again
                  setEthAddress('');
                  setConnectionPrompt('Connect');
                }
              }
            }
            // handle other "switch" errors
            // if there is an error we just ask the user to try again
            setEthAddress('');
            setConnectionPrompt('Connect');
          };
          changeNetwork();
        }
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
        // request user's eth address
        const getAccount = async () => {
          try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            ethereum.request({ method: 'eth_accounts' }).then(accounts => {
              if (accounts.length > 0) {
                setEthAddress(accounts[0]);
              } else {
                setConnectionPrompt('Connect');
              }
            });
          } catch {
            setEthAddress('');
            setConnectionPrompt('Connect');
          }
        };
        // check if the user's current chain is ethereum
        if (ethereum.chainId === '0x4') {
          // get the user's wallet address
          getAccount();
        } else {
          // request the user to change to the ethereum network
          const changeNetwork = async () => {
            try {
              await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x4' }]
              });
              // get the user's wallet address
              getAccount();
            } catch (switchError) {
              // This error code indicates that the chain has not been added to MetaMask.
              if (switchError.code === 4902) {
                try {
                  await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: '0x4',
                        rpcUrl: getRpcUrl()
                      }
                    ]
                  });
                  getAccount();
                } catch {
                  // if there is an error we just ask the user to try again
                  setEthAddress('');
                  setConnectionPrompt('Connect');
                }
              }
            }
            // handle other "switch" errors
            // if there is an error we just ask the user to try again
            setEthAddress('');
            setConnectionPrompt('Connect');
          };
          changeNetwork();
        }
      } catch {
        setConnectionText("Couldn't connect to wallet, please try again.");
      }
    }
  };

  return (
    <header className={styles.container}>
      <div>
        <Link href="/">
          <a>
            <img src="/logo.png" alt="logo" />
          </a>
        </Link>
        <nav>
          <ul>
            <li>
              <Link href="/">
                <a className={router.pathname === '/' ? styles.active : ''}>
                  Pools
                </a>
              </Link>
            </li>
            <li>
              <Link href="/dashboard">
                <a
                  className={
                    router.pathname === '/dashboard' ? styles.active : ''
                  }
                >
                  Dashboard
                </a>
              </Link>
            </li>
            <li>
              <Link href="/latest">
                <a
                  className={router.pathname === '/latest' ? styles.active : ''}
                >
                  Latest
                </a>
              </Link>
            </li>
            <li>
              <Link href="/staking">
                <a
                  className={
                    router.pathname === '/staking' ? styles.active : ''
                  }
                >
                  Staking
                </a>
              </Link>
            </li>
            <li>
              <Link href="/liquidity">
                <a
                  className={
                    router.pathname === '/liquidity' ? styles.active : ''
                  }
                >
                  Liquidity
                </a>
              </Link>
            </li>
            <li>
              <button onClick={handleConnectionClick}>
                {ethAddress !== ''
                  ? `${ethAddress.slice(1, 6)}...${ethAddress.slice(38)}`
                  : connectionPrompt}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
