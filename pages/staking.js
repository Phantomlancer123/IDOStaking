import HistoryIcon from '@material-ui/icons/History';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';

import useWeb3 from '../hooks/useWeb3'
import { useStaking, useCEToken, useCEGToken } from '../hooks/useContract'
import { getBalanceOfCE, getBalanceOfCEG, setStake, setTokenApprove, getStakeAmount, getStakeProfit, setWithdraw, getAllowance } from '../hooks/common'
import { ConnectMetamask } from '../components/ConnectMetamask';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import styles from '../styles/Staking.module.css';

export default function Staking() {
  const [ethAddress, setEthAddress] = useState('');
  const [connectionText, setConnectionText] = useState('');
  const [balance, setBalance] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [approve, setApprove] = useState(false);
  const [withdrawApprove, setWithdrawApprove] = useState(false);
  const [totalStakeAmount, setTotalStakeAmount] = useState(0);
  const [stakeProfit, setStakeProfit] = useState(0);
  const [error, setError] = useState({
    exists: false,
    error: ''
  });

  const web3 = useWeb3()
  const StakingContract = useStaking()
  const CETokenContract = useCEToken()
  const CEGTokenContract = useCEGToken()

  useEffect(async () => {
    if (ethAddress !== '') {
      setBalance(await getBalanceOfCE(web3, CETokenContract, ethAddress));
      setTotalStakeAmount(await getStakeAmount(web3, StakingContract, ethAddress));
      setStakeProfit(await getStakeProfit(web3, StakingContract, ethAddress));
      if (await getAllowance(web3, CETokenContract, ethAddress) > 1000000){
        setApprove(true);
      }
      if (await getAllowance(web3, CEGTokenContract, ethAddress) > 1000000){
        setWithdrawApprove(true);
      }
    }
  }, [ethAddress]);

  const handleStake = async () => {
    let response;
    if (approve === true) {
      response = await setStake(web3, StakingContract, ethAddress, stakeAmount);
      setTotalStakeAmount(await getStakeAmount(web3, StakingContract, ethAddress));
      setStakeProfit(await getStakeProfit(web3, StakingContract, ethAddress));
      if (response.status === true) {
        setApprove(false);
        setStakeAmount(0);
      }
    } else {
      response = await setTokenApprove(web3, CETokenContract, ethAddress, stakeAmount);
      if (response.status === true)
        setApprove(true);
    }
    return;
  }

  const withdraw = async () => {
    try {
      let response;
      if (withdrawApprove === true) {
        response = await setWithdraw(web3, StakingContract, ethAddress, totalStakeAmount);
        setTotalStakeAmount(await getStakeAmount(web3, StakingContract, ethAddress));
        setStakeProfit(await getStakeProfit(web3, StakingContract, ethAddress));
        if (response.status === true) {
          setWithdrawApprove(false);
        }
      } else {
        response = await setTokenApprove(web3, CEGTokenContract, ethAddress, totalStakeAmount);
        if (response.status === true)
        setWithdrawApprove(true);
      }
      return;
    } catch (e) {
      console.log(e)
      setError({
        exists: true,
        message: 'Error occured'
      });
      setTimeout(() => {
        setError({
          exists: false,
          message: ''
        });
      }, 4000);
      return false;
    }
  }

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
          <section className={styles.container}>
            <div className={styles.userStakingInfo}>
              <div className={styles.userTier}>
                <p>
                  Current staking APY: <span>20%</span>
                </p>
                <p>
                  Accumulated staking yield: <span>{stakeProfit} CE</span>
                </p>
                <p>
                  Validated staked amount: <span>{stakeProfit} CE</span>
                </p>
              </div>
              <div className={styles.stakingHistory}>
                <h4>Total staked amount</h4>
                <h5>{totalStakeAmount} CE</h5>
                {/* <div className={styles.history}>
                  <HistoryIcon />
                  <i> No staking history</i>
                </div> */}
                <button onClick={withdraw}>{withdrawApprove === true ? 'Withdraw' : 'Approve'}</button>
                {error.exists && (
                  <p className={styles.errorText}>{error.message}</p>
                )}
              </div>
            </div>
            <section className={styles.bottom}>
              <div className={styles.stake}>
                <div className={styles.stakeHeader}>
                  <h5>Stake Now</h5>
                </div>
                <div className={styles.stakeBody}>
                  <h5>How much do you want to stake</h5>
                  <div className={styles.stakeInput}>
                    <div className={styles.left}>
                      <span>
                        <h3>Stake</h3>
                      </span>
                      <input type="number" placeholder="stake" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} />
                    </div>
                    <div className={styles.right}>
                      <h3>Balance: {balance}</h3>
                      <div>
                        <button>MAX</button>
                        <h5>CE</h5>
                      </div>
                    </div>
                  </div>
                  <button className={styles.confirmButton} onClick={handleStake}>
                    {approve === true ? 'Confirm' : 'Approve'}
                  </button>
                </div>
              </div>
              <div className={styles.tiersInfoContainer}>
                <div className={styles.tiersInfo}>
                  <h5>Access exclusive projects in the tiers</h5>
                  <p>
                    Crypto Excellence has 4 tiers where candidates are investing
                    in promising projects with exclusive terms.
                  </p>
                  <div className={styles.tiers}>
                    <div>
                      <img src="/professor.png" alt="professor" />
                      <p>1.Professor</p>
                    </div>
                    <div>
                      <img src="/doctorate.jpg" alt="doctorate" />
                      <p>2.Doctorate</p>
                    </div>
                    <div>
                      <img src="/graduate.jpeg" alt="graduate" />
                      <p>3.Graduate</p>
                    </div>
                    <div>
                      <img src="/student.png" alt="student" />
                      <p>4.Student</p>
                    </div>
                  </div>
                  <button>LEARN MORE</button>
                </div>
              </div>
            </section>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
