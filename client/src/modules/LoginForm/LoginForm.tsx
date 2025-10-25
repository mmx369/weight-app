import { useContext, useState } from 'react';
import { Context } from '../..';

import classes from './LoginForm.module.css';
import { emailValidation, passwordValidation } from './helper/validate';
import { useInput } from './hooks/use-input';

import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notify } from '../../shared/helper/notify';
import { ReCaptcha } from '../../shared/components';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const {
    value: email,
    isValid: enteredEmailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput((value) => emailValidation(value));

  const {
    value: password,
    isValid: enteredPasswordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput((value: string) => passwordValidation(value));

  const { store } = useContext(Context);

  let formIsValid = false;

  if (enteredEmailIsValid && enteredPasswordIsValid && recaptchaToken) {
    formIsValid = true;
  }

  const formSubmissionHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredEmailIsValid || !enteredPasswordIsValid || !recaptchaToken) {
      return;
    }

    setIsLoading(true);

    try {
      await store.login(email, password, recaptchaToken || undefined);
      resetEmailInput();
      resetPasswordInput();
      navigate('/');
    } catch (error: any) {
      const errorMessage =
        error.message || error || 'Login failed. Please try again.';
      notify(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecaptchaVerify = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleRecaptchaError = () => {
    setRecaptchaToken(null);
    notify('reCAPTCHA error. Please try again.', 'error');
  };

  const emailInputClasses = emailHasError
    ? `${classes.form_control} ${classes.invalid}`
    : classes.form_control;

  const passwordInputClasses = passwordHasError
    ? `${classes.form_control} ${classes.invalid}`
    : classes.form_control;

  return (
    <>
      <div className={classes.loginContainer}>
        <h2 className={classes.title}>Welcome Back</h2>
        <p className={classes.subtitle}>Sign in to your account</p>

        <form onSubmit={formSubmissionHandler}>
          <div className={classes.control_group}>
            <div className={emailInputClasses}>
              <label htmlFor='email'>Email</label>
              <input
                type='text'
                name='email'
                placeholder='Email'
                onChange={emailChangeHandler}
                onBlur={emailBlurHandler}
                value={email}
              />
              {emailHasError && (
                <p className={classes.error_text}>
                  You should provide a valid email.
                </p>
              )}
            </div>
            <div className={passwordInputClasses}>
              <label htmlFor='password'>Password</label>
              <div className={classes.passwordInput}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  placeholder='Password'
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                  value={password}
                />
                <button
                  type='button'
                  className={classes.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.5'
                    >
                      <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
                      <line x1='1' y1='1' x2='23' y2='23' />
                    </svg>
                  ) : (
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.5'
                    >
                      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                      <circle cx='12' cy='12' r='3' />
                    </svg>
                  )}
                </button>
              </div>
              {passwordHasError && (
                <p className={classes.error_text}>
                  The password must contain at least 1 lowercase, 1 uppercase, 1
                  number and at least 8 characters.
                </p>
              )}
            </div>

            <ReCaptcha
              siteKey={(() => {
                const key =
                  process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
                  '6LcV6_YrAAAAAKsu57Cy9XJPeoxoGQTnMmWhj55q';
                return key;
              })()}
              action='login'
              onVerify={handleRecaptchaVerify}
              onError={handleRecaptchaError}
            />

            <div className={classes.form_actions}>
              <button
                className={classes.button}
                type='submit'
                disabled={isLoading || !formIsValid}
                onClick={() =>
                  console.log('Button clicked, isLoading:', isLoading)
                }
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </div>
        </form>

        <div className={classes.registerLink}>
          <p>Don't have an account yet?</p>
          <Link to='/register' className={classes.link}>
            Create a new account
          </Link>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
