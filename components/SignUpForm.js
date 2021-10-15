import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from 'axios';
import cookieCutter from 'cookie-cutter';
import { useFormik } from 'formik';
import Link from 'next/link';
import React, { useState } from 'react';
import * as yup from 'yup';

import styles from '../styles/SignUpForm.module.css';

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  confirm_password: yup
    .string('confirm your password')
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Confirm your password')
});

const useStyles = makeStyles(() => ({
  visibility: {
    verticalAlign: 'middle',
    cursor: 'pointer',
    marginLeft: '-30px'
  }
}));

const SignUpForm = () => {
  const classes = useStyles();
  const [signUpState, setSignUpState] = useState({
    showPassword: false,
    showConfirmPassword: false
  });
  const [pwdIsEqual, setPwdIsEqual] = useState(true);
  const [signUpError, setSignUpError] = useState({
    exists: false,
    error: ''
  });
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirm_password: ''
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      const user = values;
      if (values.password !== values.confirm_password) {
        setPwdIsEqual(false);
        setTimeout(() => setPwdIsEqual(true), 5000);
      } else {
        setPwdIsEqual(true);

        const headers = {
          'Content-Type': 'application/json'
        };
        axios({
          method: 'post',
          url: `${process.env.NEXT_PUBLIC_FORWARDER_ORIGIN}/api/auth/signup`,
          headers,
          data: user
        })
          .then(response => {
            setSignUpError({
              exists: false,
              message: ''
            });
            // cookieCutter.set('access_token', response.data.access_token);
            // cookieCutter.set('refresh_token', response.data.access_token);
            window.location = '/admin/login';
          })
          .catch(error => {
            setSignUpError({
              exists: true,
              message: error.response.data.message
            });
            setTimeout(() => {
              setSignUpError({
                exists: false,
                message: ''
              });
            }, 8000);
          });
      }
    }
  });

  const handleClickShowPassword = () => {
    setSignUpState({ ...signUpState, showPassword: !signUpState.showPassword });
  };

  const handleClickShowConfirmPassword = () => {
    setSignUpState({
      ...signUpState,
      showConfirmPassword: !signUpState.showConfirmPassword
    });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };
  return (
    <div className={styles.formContainer}>
      <div>
        <h3 className={styles.formTitle}>Sign up</h3>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <div className={styles.inputsContainer}>
            <div>
              <input
                id="email"
                name="email"
                placeholder="Email"
                type="text"
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
                type={signUpState.showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {signUpState.showPassword ? (
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
            <div>
              <input
                id="confirm_password"
                type={signUpState.showConfirmPassword ? 'text' : 'password'}
                name="confirm_password"
                placeholder="Confirm password"
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
              />
              {signUpState.showConfirmPassword ? (
                <Visibility
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownPassword}
                  className={classes.visibility}
                />
              ) : (
                <VisibilityOff
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownPassword}
                  className={classes.visibility}
                />
              )}
              {formik.touched.confirm_password &&
              formik.errors.confirm_password ? (
                <p className={styles.errorText}>
                  {formik.errors.confirm_password}
                </p>
              ) : null}
              {!pwdIsEqual && (
                <p className={styles.errorText}>Passwords must match</p>
              )}
            </div>
          </div>
          {signUpError.exists && (
            <p className={styles.errorText}>{signUpError.message}</p>
          )}
          <div className={styles.buttonsContainer}>
            <button type="submit" className={styles.button}>
              Create Account
            </button>
            <div className={styles.login}>
              Already have an account?{' '}
              <Link href="/admin/login">
                <a className={styles.login_link}>Log in</a>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
