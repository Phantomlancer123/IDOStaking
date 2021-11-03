import { makeStyles } from '@material-ui/core/styles';
const { ethers } = require('ethers')
import axios from 'axios';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import * as yup from 'yup';

import CEToken from '../hooks/abis/CEToken.json'
import { ConnectMetamask } from './ConnectMetamask';
import useWeb3 from '../hooks/useWeb3'
import { useIDOFactory, useCEToken, useNewToken } from '../hooks/useContract'
import { addIdo, setCEApproveFactory } from '../hooks/common'
import styles from '../styles/AddIdoForm.module.css';

const validationSchema = yup.object({
  name: yup
    .string('Enter the project name')
    .required('Project name is required'),
  logo: yup
    .string('Enter the project logo')
    .required('Project logo is required'),
  website: yup
    .string('Enter the project website url')
    .url('Project website should be a valid url')
    .required('Project website is required'),
  twitter: yup
    .string('Enter the project twitter')
    .url('Project twitter should be a valid url')
    .required('Project twitter is required'),
  telegram: yup
    .string('Enter the project telegram')
    .url('Project telegram should be a valid url')
    .required('Project telegram is required'),
  status: yup
    .mixed()
    .oneOf(['LIVE', 'UPCOMING', 'COMPLETED'])
    .required('Ido status is required'),
  pair: yup.string('Enter the ido pair').required('Ido pair is required'),
  description: yup
    .string('Enter the project description')
    .required('Description is required'),
  swapRate: yup
    .string('Enter the ido swap rate')
    .required('Swap rate is required'),
  symbol: yup
    .string("Enter the project's token symbol")
    .required('Symbol is required'),
  supply: yup
    .string("Enter the project's token supply")
    .required('Supply is required'),
  price: yup.string('Enter the ido price').required('Price is required'),
  poolCap: yup
    .string('Enter the ido pool cap')
    .required('Pool cap is required'),
  access: yup
    .mixed()
    .oneOf(['PRIVATE', 'PUBLIC'])
    .required('access is required'),
  tokenAddress: yup
    .string('Enter the ido token address')
    .required('Token address is required'),
  whitelistedAddresses: yup
    .string('Enter the ido whitelisted addresses')
    .required('whitelisted addresses is required'),
  hardCap: yup.string('Enter the ido hard cap').required('Hard cap is required'),
  softCap: yup.string('Enter the ido soft cap').required('soft cap is required'),
  maxInvest: yup.string('Enter the ido max invest').required('Max invest is required'),
  minInvest: yup.string('Enter the ido min invest').required('Min invest is required'),
  openTime: yup.string('Enter the ido open time').required('Open time is required'),
  closeTime: yup.string('Enter the ido close time').required('Close time is required')
});

const AddIdoForm = () => {
  const [ethAddress, setEthAddress] = useState('');
  const [connectionText, setConnectionText] = useState('');
  const [approve, setApprove] = useState(false);
  const [whitelist, setWhitelist] = useState('');
  const web3 = useWeb3()
  const FactoryContract = useIDOFactory()
  const CETokenContract = useCEToken()

  const [idoError, setIdoError] = useState({
    exists: false,
    error: ''
  });
  const [idoSuccess, setIdoSuccess] = useState({
    exists: false,
    message: ''
  });

  useEffect(() => {
    getWhitelist();
  }, []);

  const getWhitelist = async () => {
    const url = '/api/whitelist';
    const response = await axios.get(url);
    if (response.data.length > 0)
      setWhitelist(response.data[0].address);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      logo: '',
      website: '',
      twitter: '',
      telegram: '',
      progress: '',
      status: '',
      pair: '',
      description: '',
      swapRate: '',
      symbol: '',
      supply: '',
      price: '',
      poolCap: '',
      access: '',
      tokenAddress: '',
      whitelistedAddresses: '',
      hardCap: '',
      softCap: '',
      maxInvest: '',
      minInvest: '',
      openTime: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
      closeTime: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (approve === false) {
        const abi = CEToken.abi;
        const newTokenContract = new web3.eth.Contract(abi, values.tokenAddress);
        await setCEApproveFactory(web3, newTokenContract, ethAddress, 99999999);
        if (response.status === true)
          setApprove(true);
      } else {
        if (new Date(values.closeTime).getTime() / 1000 === new Date(values.openTime).getTime() / 1000) {
          setIdoError({
            exists: true,
            message: 'Close time should be later than open time'
          });
          setTimeout(() => {
            setIdoError({
              exists: false,
              message: ''
            });
          }, 4000);
          return;
        }
        let addedWhitelist = values.whitelistedAddresses.split(',');
        if (whitelist.length > 0){
          addedWhitelist = addedWhitelist.concat(whitelist.split(","));
        }
        // const IdoMainInfo = {
        //   tokenAddress: '0xF32075F125e39813810c9d9D86B1e11F8686Be23',
        //   whitelistedAddresses: addedWhitelist,
        //   tokenPriceInWei: web3.utils.toWei(values.price, 'ether'),
        //   hardCapInWei: web3.utils.toWei(values.hardCap, 'ether'),
        //   softCapInWei: web3.utils.toWei(values.softCap, 'ether'),
        //   maxInvestInWei: web3.utils.toWei(values.maxInvest, 'ether'),
        //   minInvestInWei: web3.utils.toWei(values.minInvest, 'ether'),
        //   openTime: new Date(values.openTime).getTime() / 1000,
        //   closeTime: new Date(values.closeTime).getTime() / 1000,
        //   decimals: 18,
        // };

        // const Links = {
        //   saleTitle: ethers.utils.formatBytes32String(values.name),
        //   linkTelegram: ethers.utils.formatBytes32String(values.telegram),
        //   linkDiscord: ethers.utils.formatBytes32String(''),
        //   linkTwitter: ethers.utils.formatBytes32String(values.twitter),
        //   linkWebsite: ethers.utils.formatBytes32String(values.website),
        // };
        // let addStatus;
        // try {
        //   addStatus = await addIdo(web3, FactoryContract, ethAddress, IdoMainInfo, Links);
        // } catch (e) {
        //   setIdoError({
        //     exists: true,
        //     message: e.code + " - " + e.argument
        //   });
        //   setTimeout(() => {
        //     setIdoError({
        //       exists: false,
        //       message: ''
        //     });
        //   }, 4000);
        //   return;
        // }
        // if (addStatus.status === true) {
        //   const ido = {
        //     ...values,
        //     address: addStatus.events.IDOCreated.returnValues.idoAddress
        //   };
        //   const token = Cookies.get('access_token');
        //   const headers = {
        //     'Content-Type': 'application/json',
        //     authorization: `Bearer ${token}`
        //   };
        //   axios({
        //     method: 'post',
        //     url: `${process.env.NEXT_PUBLIC_FORWARDER_ORIGIN}/api/idos`,
        //     headers,
        //     data: ido
        //   })
        //     .then(response => {
        //       setIdoSuccess({
        //         exists: true,
        //         message: 'Ido added succesfully'
        //       });
        //       setTimeout(() => {
        //         setIdoSuccess({
        //           exists: false,
        //           message: ''
        //         });
        //       }, 4000);
        //     })
        //     .catch(error => {
        //       setIdoError({
        //         exists: true,
        //         message: error.response.data.message
        //       });
        //       setTimeout(() => {
        //         setIdoError({
        //           exists: false,
        //           message: ''
        //         });
        //       }, 4000);
        //     });
        // }
      }
    }
  });

  const handleClickShowPassword = () => {
    setSignInState({ ...signInState, showPassword: !signInState.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const addIdoForm = async (info, link, presale) => {
    console.log(info)
    try {
      let response = await addIdo(web3, FactoryContract, ethAddress, info, link);
      console.log(response,"++++++++")
      return response.status;
    } catch (e) {
      setIdoError({
        exists: true,
        message: e.code + " - " + e.argument
      });
      setTimeout(() => {
        setIdoError({
          exists: false,
          message: ''
        });
      }, 4000);
      return false;
    }
  }

  return (
    <div className={styles.formContainer}>
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
        <div>
          <h3 className={styles.formTitle}>Add ido</h3>
          <form onSubmit={formik.handleSubmit} className={styles.form}>
            <div className={styles.inputsContainer}>
              <div>
                <p>Name</p>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
                {formik.touched.name && formik.errors.name ? (
                  <p className={styles.errorText}>{formik.errors.name}</p>
                ) : null}
              </div>
              <div>
                <p>Logo</p>
                <input
                  id="logo"
                  name="logo"
                  type="text"
                  placeholder="logo"
                  value={formik.values.logo}
                  onChange={formik.handleChange}
                />
                {formik.touched.name && formik.errors.logo ? (
                  <p className={styles.errorText}>{formik.errors.logo}</p>
                ) : null}
              </div>
              <div>
                <p>Website</p>
                <input
                  id="website"
                  name="website"
                  type="text"
                  placeholder="website"
                  value={formik.values.website}
                  onChange={formik.handleChange}
                />
                {formik.touched.website && formik.errors.website ? (
                  <p className={styles.errorText}>{formik.errors.website}</p>
                ) : null}
              </div>
              <div>
                <p>Twitter</p>
                <input
                  id="twitter"
                  name="twitter"
                  type="text"
                  placeholder="twitter"
                  value={formik.values.twitter}
                  onChange={formik.handleChange}
                />
                {formik.touched.twitter && formik.errors.twitter ? (
                  <p className={styles.errorText}>{formik.errors.twitter}</p>
                ) : null}
              </div>
              <div>
                <p>Telegram</p>
                <input
                  id="telegram"
                  name="telegram"
                  type="text"
                  placeholder="telegram"
                  value={formik.values.telegram}
                  onChange={formik.handleChange}
                />
                {formik.touched.telegram && formik.errors.telegram ? (
                  <p className={styles.errorText}>{formik.errors.telegram}</p>
                ) : null}
              </div>
              <div>
                <p>Status</p>
                <input
                  id="status"
                  name="status"
                  type="text"
                  placeholder="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                />
                {formik.touched.status && formik.errors.status ? (
                  <p className={styles.errorText}>{formik.errors.status}</p>
                ) : null}
              </div>
              <div>
                <p>Pair</p>
                <input
                  id="pair"
                  name="pair"
                  type="text"
                  placeholder="pair"
                  value={formik.values.pair}
                  onChange={formik.handleChange}
                />
                {formik.touched.pair && formik.errors.pair ? (
                  <p className={styles.errorText}>{formik.errors.pair}</p>
                ) : null}
              </div>
              <div>
                <p>Description</p>
                <input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
                {formik.touched.description && formik.errors.description ? (
                  <p className={styles.errorText}>{formik.errors.description}</p>
                ) : null}
              </div>
              <div>
                <p>Swap rate</p>
                <input
                  id="swapRate"
                  name="swapRate"
                  type="text"
                  placeholder="swapRate"
                  value={formik.values.swapRate}
                  onChange={formik.handleChange}
                />
                {formik.touched.swapRate && formik.errors.swapRate ? (
                  <p className={styles.errorText}>{formik.errors.swapRate}</p>
                ) : null}
              </div>
              <div>
                <p>Symbol</p>
                <input
                  id="symbol"
                  name="symbol"
                  type="text"
                  placeholder="symbol"
                  value={formik.values.symbol}
                  onChange={formik.handleChange}
                />
                {formik.touched.symbol && formik.errors.symbol ? (
                  <p className={styles.errorText}>{formik.errors.symbol}</p>
                ) : null}
              </div>
              <div>
                <p>Supply</p>
                <input
                  id="supply"
                  name="supply"
                  type="text"
                  placeholder="supply"
                  value={formik.values.supply}
                  onChange={formik.handleChange}
                />
                {formik.touched.supply && formik.errors.supply ? (
                  <p className={styles.errorText}>{formik.errors.supply}</p>
                ) : null}
              </div>
              <div>
                <p>Price</p>
                <input
                  id="price"
                  name="price"
                  type="text"
                  placeholder="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                />
                {formik.touched.price && formik.errors.price ? (
                  <p className={styles.errorText}>{formik.errors.price}</p>
                ) : null}
              </div>
              <div>
                <p>Pool cap</p>
                <input
                  id="poolCap"
                  name="poolCap"
                  type="text"
                  placeholder="pool cap"
                  value={formik.values.poolCap}
                  onChange={formik.handleChange}
                />
                {formik.touched.poolCap && formik.errors.poolCap ? (
                  <p className={styles.errorText}>{formik.errors.poolCap}</p>
                ) : null}
              </div>
              <div>
                <p>Access</p>
                <input
                  id="access"
                  name="access"
                  type="text"
                  placeholder="access"
                  value={formik.values.access}
                  onChange={formik.handleChange}
                />
                {formik.touched.access && formik.errors.access ? (
                  <p className={styles.errorText}>{formik.errors.access}</p>
                ) : null}
              </div>
              <div>
                <p>Token Address</p>
                <input
                  id="tokenAddress"
                  name="tokenAddress"
                  type="text"
                  placeholder="token address"
                  value={formik.values.tokenAddress}
                  onChange={formik.handleChange}
                />
                {formik.touched.tokenAddress && formik.errors.tokenAddress ? (
                  <p className={styles.errorText}>{formik.errors.tokenAddress}</p>
                ) : null}
              </div>
              <div>
                <p>Whitelisted Addresses</p>
                <input
                  id="whitelistedAddresses"
                  name="whitelistedAddresses"
                  type="text"
                  placeholder="whitelisted Addresses - please input with split <,>"
                  value={formik.values.whitelistedAddresses}
                  onChange={formik.handleChange}
                />
                {formik.touched.whitelistedAddresses && formik.errors.whitelistedAddresses ? (
                  <p className={styles.errorText}>{formik.errors.whitelistedAddresses}</p>
                ) : null}
              </div>
              <div>
                <p>Hard Cap</p>
                <input
                  id="hardCap"
                  name="hardCap"
                  type="text"
                  placeholder="hard cap"
                  value={formik.values.hardCap}
                  onChange={formik.handleChange}
                />
                {formik.touched.hardCap && formik.errors.hardCap ? (
                  <p className={styles.errorText}>{formik.errors.hardCap}</p>
                ) : null}
              </div>
              <div>
                <p>Soft Cap</p>
                <input
                  id="softCap"
                  name="softCap"
                  type="text"
                  placeholder="soft cap"
                  value={formik.values.softCap}
                  onChange={formik.handleChange}
                />
                {formik.touched.softCap && formik.errors.softCap ? (
                  <p className={styles.errorText}>{formik.errors.softCap}</p>
                ) : null}
              </div>
              <div>
                <p>Max Invest</p>
                <input
                  id="maxInvest"
                  name="maxInvest"
                  type="text"
                  placeholder="max invest"
                  value={formik.values.maxInvest}
                  onChange={formik.handleChange}
                />
                {formik.touched.maxInvest && formik.errors.maxInvest ? (
                  <p className={styles.errorText}>{formik.errors.maxInvest}</p>
                ) : null}
              </div>
              <div>
                <p>Min Invest</p>
                <input
                  id="minInvest"
                  name="minInvest"
                  type="text"
                  placeholder="min invest"
                  value={formik.values.minInvest}
                  onChange={formik.handleChange}
                />
                {formik.touched.minInvest && formik.errors.minInvest ? (
                  <p className={styles.errorText}>{formik.errors.minInvest}</p>
                ) : null}
              </div>
              <div>
                <p>Open Time</p>
                <input
                  id="openTime"
                  name="openTime"
                  type="text"
                  placeholder="open time (2021-10-20)"
                  value={formik.values.openTime}
                  onChange={formik.handleChange}
                />
                {formik.touched.openTime && formik.errors.openTime ? (
                  <p className={styles.errorText}>{formik.errors.openTime}</p>
                ) : null}
              </div>
              <div>
                <p>Close Time</p>
                <input
                  id="closeTime"
                  name="closeTime"
                  type="text"
                  placeholder="close time (2021-10-20)"
                  value={formik.values.closeTime}
                  onChange={formik.handleChange}
                />
                {formik.touched.closeTime && formik.errors.closeTime ? (
                  <p className={styles.errorText}>{formik.errors.closeTime}</p>
                ) : null}
              </div>
            </div>
            {idoError.exists && (
              <p className={styles.errorText}>{idoError.message}</p>
            )}
            {idoSuccess.exists && (
              <p className={styles.successText}>{idoSuccess.message}</p>
            )}
            <button type="submit" className={styles.button}>
              {approve === true ? 'Add' : 'Approve'}
            </button>
          </form>
        </div>
      )
      }
    </div>
  );
};

export default AddIdoForm;
