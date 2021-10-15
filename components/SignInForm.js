import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from 'axios';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import * as yup from 'yup';

import styles from '../styles/SignInForm.module.css';

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup.string('Enter your password').required('Password is required')
});

const useStyles = makeStyles(() => ({
  visibility: {
    verticalAlign: 'middle',
    cursor: 'pointer',
    marginLeft: '-30px'
  }
}));

const SignInForm = () => {
  const router = useRouter();
  const classes = useStyles();
  const [signInState, setSignInState] = useState({
    showPassword: false
  });
  const [signInError, setSignInError] = useState({
    exists: false,
    error: ''
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      // change email to lowercase before submitting to api
      // since some browsers capitalize first later by default
      const user = {
        ...values,
        email: values.email.toLowerCase()
      };

      const headers = {
        'Content-Type': 'application/json'
      };
      axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_FORWARDER_ORIGIN}/api/auth/signin`,
        headers,
        data: user
      })
        .then(response => {
          setSignInError({
            exists: false,
            message: ''
          });
          Cookies.set('access_token', response.data.access_token);
          Cookies.set('refresh_token', response.data.refresh_token);
          router.push('/admin/dashboard');
        })
        .catch(error => {
          setSignInError({
            exists: true,
            message: error.response.data.message
          });
          setTimeout(() => {
            setSignInError({
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
        <h3 className={styles.formTitle}>Sign In</h3>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <div>
            <input
              id="email"
              name="email"
              type="text"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className={styles.errorText}>{formik.errors.email}</p>
            ) : null}
          </div>
          <div>
            <input
              id="password"
              placeholder="Password"
              type={signInState.showPassword ? 'text' : 'password'}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              autoComplete="current-password"
            />
            {signInState.showPassword ? (
              <Visibility
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                className={classes.visibility}
              />
            ) : (
              <VisibilityOff
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                className={classes.visibility}
              />
            )}
            {formik.touched.password && formik.errors.password ? (
              <p className={styles.errorText}>{formik.errors.password}</p>
            ) : null}
          </div>
          {signInError.exists && (
            <p className={styles.errorText}>{signInError.message}</p>
          )}
          <button type="submit" className={styles.button}>
            Sign in
          </button>
          <div className={styles.createAccount}>
            <p className={styles.p}>New here? </p>
            <Link href="/admin/signup">
              <a className={styles.signup_link}>Create an account</a>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
