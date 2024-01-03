import { useContext } from 'react'
import { Context } from '../..'

import classes from './LoginForm.module.css'
import { emailValidation, passwordValidation } from './helper/validate'
import { useInput } from './hooks/use-input'

import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { notify } from '../../shared/helper/notify'

export const LoginForm: React.FC = () => {
  const navigate = useNavigate()

  const {
    value: email,
    isValid: enteredEmailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput((value) => emailValidation(value))

  const {
    value: password,
    isValid: enteredPasswordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput((value: string) => passwordValidation(value))

  const { store } = useContext(Context)

  let formIsValid = false

  if (enteredEmailIsValid && enteredPasswordIsValid) {
    formIsValid = true
  }

  const formSubmissionHandler = (e: React.FormEvent) => {
    e.preventDefault()
    if (!enteredEmailIsValid && !enteredPasswordIsValid) {
      return
    }
    store
      .login(email, password)
      .then(() => {
        resetEmailInput()
        resetPasswordInput()
        navigate('/')
      })
      .catch((error) => notify(error, 'error'))
  }

  const registrationHandler = () => {
    store
      .registration(email, password)
      .then(() => {
        resetEmailInput()
        resetPasswordInput()
        navigate('/')
      })
      .catch((error) => {
        notify(error, 'error')
      })
  }

  const emailInputClasses = emailHasError
    ? `${classes.form_control} ${classes.invalid}`
    : classes.form_control

  const passwordInputClasses = passwordHasError
    ? `${classes.form_control} ${classes.invalid}`
    : classes.form_control

  return (
    <>
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
            <input
              type='password'
              name='password'
              placeholder='Password'
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              value={password}
            />
            {passwordHasError && (
              <p className={classes.error_text}>
                The password must contain at least 1 lowercase, 1 uppercase, 1
                number and at least 8 characters.
              </p>
            )}
          </div>
          <div className={classes.form_actions}>
            <button
              className={classes.button}
              type='submit'
              disabled={!formIsValid}
            >
              Sign In
            </button>
            <button
              className={classes.button}
              type='button'
              disabled={!formIsValid}
              onClick={registrationHandler}
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  )
}
