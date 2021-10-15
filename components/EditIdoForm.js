import axios from 'axios';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import * as yup from 'yup';

import styles from '../styles/EditIdoForm.module.css';

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
    .required('access is required')
});

const EditIdoForm = ({ ido }) => {
  const [idoError, setIdoError] = useState({
    exists: false,
    error: ''
  });
  const [idoSuccess, setIdoSuccess] = useState({
    exists: false,
    message: ''
  });

  const formik = useFormik({
    initialValues: {
      name: ido.name,
      logo: ido.logo,
      website: ido.website,
      twitter: ido.twitter,
      telegram: ido.telegram,
      progress: ido.progress,
      status: ido.status,
      pair: ido.pair,
      description: ido.description,
      swapRate: ido.swapRate,
      symbol: ido.symbol,
      supply: ido.supply,
      price: ido.price,
      poolCap: ido.poolCap,
      access: ido.access
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const updatedIdo = {
        ...values
      };

      const token = Cookies.get('access_token');
      const headers = {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      };
      axios({
        method: 'put',
        url: `${process.env.NEXT_PUBLIC_FORWARDER_ORIGIN}/api/idos`,
        headers,
        data: updatedIdo
      })
        .then(response => {
          setIdoSuccess({
            exists: true,
            message: 'Ido updated succesfully'
          });
          setTimeout(() => {
            setIdoSuccess({
              exists: false,
              message: ''
            });
          }, 4000);
        })
        .catch(error => {
          setIdoError({
            exists: true,
            message: error.response.data.message
          });
          setTimeout(() => {
            setIdoError({
              exists: false,
              message: ''
            });
          }, 4000);
        });
    }
  });

  const handleClickShowPassword = () => {
    setSignInState({ ...signInState, showPassword: !signInState.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };
  return (
    <div className={styles.formContainer}>
      <div>
        <h3 className={styles.formTitle}>Edit ido</h3>
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
          </div>
          {idoError.exists && (
            <p className={styles.errorText}>{idoError.message}</p>
          )}
          {idoSuccess.exists && (
            <p className={styles.successText}>{idoSuccess.message}</p>
          )}
          <button type="submit" className={styles.button}>
            update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditIdoForm;
