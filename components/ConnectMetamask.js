import MetaMaskOnboarding from '@metamask/onboarding';
import React, { useEffect, useState } from 'react';

import styles from '../styles/ConnectMetamask.module.css';

export const ConnectMetamask = ({
  setEthAddress,
  connectionText,
  setConnectionText
}) => {
  const [metaMaskExists, setMetamaskExists] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { ethereum } = window;

      const metaMaskClientCheck = () => {
        const metaMaskInstalled = Boolean(ethereum && ethereum.isMetaMask);
        if (!metaMaskInstalled) {
          setConnectionText(
            'Please install the metamask browser extension. After successfully installing the extention, refresh this page.'
          );
        } else {
          setMetamaskExists(true);
          setConnectionText('Please connect your Ethereum wallet');
        }
      };
      const initialize = () => {
        metaMaskClientCheck();
      };
      initialize();
    }
  }, [setConnectionText]);

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
                setConnectionText(
                  "Couldn't connect to wallet, please try again."
                );
              }
            });
          } catch {
            setEthAddress('');
            setConnectionText("Couldn't connect to wallet, please try again.");
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
                // params: [{ chainId: '0x1' }]
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
                        rpcUrl:
                          // 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
                          'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
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
            setConnectionText("Couldn't connect to wallet, please try again.");
          };
          changeNetwork();
        }
      } catch {
        setConnectionText("Couldn't connect to wallet, please try again.");
      }
    }
  };
  return (
    <div
      className={styles.walletPrompt}
      onClick={handleConnectionClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleConnectionClick}
    >
      <p>{connectionText}</p>
      <img src="/metamask.svg" alt="metamask logo" />
    </div>
  );
};
