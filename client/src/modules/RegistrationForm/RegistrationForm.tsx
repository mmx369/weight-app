import { useContext, useState } from 'react';
import { Context } from '../..';

import classes from './RegistrationForm.module.css';
import {
  emailValidation,
  passwordValidation,
} from '../LoginForm/helper/validate';
import { useInput } from '../LoginForm/hooks/use-input';

import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReCaptcha } from '../../shared/components';
import { notify } from '../../shared/helper/notify';

export const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const { store } = useContext(Context);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  // Email validation
  const {
    value: email,
    isValid: enteredEmailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput((value) => emailValidation(value));

  // Password validation
  const {
    value: password,
    isValid: enteredPasswordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput((value: string) => passwordValidation(value));

  // Confirm password validation
  const {
    value: confirmPassword,
    isValid: enteredConfirmPasswordIsValid,
    hasError: confirmPasswordHasError,
    valueChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
    reset: resetConfirmPasswordInput,
  } = useInput((value: string) => value === password && value.length > 0);

  // First name validation
  const {
    value: firstName,
    isValid: enteredFirstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    reset: resetFirstNameInput,
  } = useInput((value) => value.trim().length >= 2);

  // Last name validation
  const {
    value: lastName,
    isValid: enteredLastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    reset: resetLastNameInput,
  } = useInput((value) => value.trim().length >= 2);

  // Date of birth validation
  const {
    value: dateOfBirth,
    isValid: enteredDateOfBirthIsValid,
    hasError: dateOfBirthHasError,
    valueChangeHandler: dateOfBirthChangeHandler,
    inputBlurHandler: dateOfBirthBlurHandler,
    reset: resetDateOfBirthInput,
  } = useInput((value) => {
    if (!value) return false;
    const date = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 13 && age <= 120;
  });

  // Height validation
  const {
    value: height,
    isValid: enteredHeightIsValid,
    hasError: heightHasError,
    valueChangeHandler: heightChangeHandler,
    inputBlurHandler: heightBlurHandler,
    reset: resetHeightInput,
  } = useInput((value) => {
    const heightNum = parseFloat(value);
    return !isNaN(heightNum) && heightNum >= 100 && heightNum <= 250;
  });

  // Gender validation
  const [gender, setGender] = useState('');
  const [genderTouched, setGenderTouched] = useState(false);

  const genderHasError = genderTouched && !gender;

  let formIsValid = false;

  if (
    enteredEmailIsValid &&
    enteredPasswordIsValid &&
    enteredConfirmPasswordIsValid &&
    enteredFirstNameIsValid &&
    enteredLastNameIsValid &&
    enteredDateOfBirthIsValid &&
    enteredHeightIsValid &&
    gender &&
    recaptchaToken
  ) {
    formIsValid = true;
  }

  const formSubmissionHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formIsValid) {
      notify('Please fill in all fields correctly', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create registration data
      const registrationData = {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        height: parseFloat(height),
        gender,
      };

      // Call registration API
      await store.registration(
        email,
        password,
        registrationData,
        recaptchaToken || undefined
      );

      // Reset form
      resetEmailInput();
      resetPasswordInput();
      resetConfirmPasswordInput();
      resetFirstNameInput();
      resetLastNameInput();
      resetDateOfBirthInput();
      resetHeightInput();
      setGender('');
      setGenderTouched(false);
      setShowPassword(false);
      setShowConfirmPassword(false);

      // Success message
      notify(
        '✅ Account created successfully! Please check your email to activate your account.',
        'success'
      );

      // Navigate to login page after a short delay
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (error: any) {
      // Store already extracts the message, so we can use it directly
      const errorMessage =
        error.message || error || 'Registration failed. Please try again.';
      notify(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecaptchaVerify = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleRecaptchaError = () => {
    setRecaptchaToken(null);
    notify('reCAPTCHA error. Please try again.', 'error');
  };

  const getInputClasses = (hasError: boolean) => {
    return hasError
      ? `${classes.form_control} ${classes.invalid}`
      : classes.form_control;
  };

  return (
    <>
      <div className={classes.registrationContainer}>
        <h2 className={classes.title}>Create Account</h2>
        <p className={classes.subtitle}>
          Join us to start tracking your weight journey
        </p>

        <form onSubmit={formSubmissionHandler}>
          <div className={classes.formGrid}>
            {/* Personal Information */}
            <div className={classes.section}>
              <h3 className={classes.sectionTitle}>Personal Information</h3>

              <div className={classes.row}>
                <div className={getInputClasses(firstNameHasError)}>
                  <label htmlFor='firstName'>First Name *</label>
                  <input
                    type='text'
                    name='firstName'
                    placeholder='Enter your first name'
                    onChange={firstNameChangeHandler}
                    onBlur={firstNameBlurHandler}
                    value={firstName}
                  />
                  {firstNameHasError && (
                    <p className={classes.error_text}>
                      First name must be at least 2 characters long.
                    </p>
                  )}
                </div>

                <div className={getInputClasses(lastNameHasError)}>
                  <label htmlFor='lastName'>Last Name *</label>
                  <input
                    type='text'
                    name='lastName'
                    placeholder='Enter your last name'
                    onChange={lastNameChangeHandler}
                    onBlur={lastNameBlurHandler}
                    value={lastName}
                  />
                  {lastNameHasError && (
                    <p className={classes.error_text}>
                      Last name must be at least 2 characters long.
                    </p>
                  )}
                </div>
              </div>

              <div className={classes.row}>
                <div className={getInputClasses(dateOfBirthHasError)}>
                  <label htmlFor='dateOfBirth'>Date of Birth *</label>
                  <input
                    type='date'
                    name='dateOfBirth'
                    onChange={dateOfBirthChangeHandler}
                    onBlur={dateOfBirthBlurHandler}
                    value={dateOfBirth}
                  />
                  {dateOfBirthHasError && (
                    <p className={classes.error_text}>
                      Please enter a valid date of birth (age 13-120).
                    </p>
                  )}
                </div>

                <div className={getInputClasses(heightHasError)}>
                  <label htmlFor='height'>Height (cm) *</label>
                  <input
                    type='number'
                    name='height'
                    placeholder='Enter your height'
                    min='100'
                    max='250'
                    step='0.1'
                    onChange={heightChangeHandler}
                    onBlur={heightBlurHandler}
                    value={height}
                  />
                  {heightHasError && (
                    <p className={classes.error_text}>
                      Height must be between 100 and 250 cm.
                    </p>
                  )}
                </div>
              </div>

              <div className={getInputClasses(genderHasError)}>
                <label htmlFor='gender'>Gender *</label>
                <select
                  name='gender'
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setGenderTouched(true);
                  }}
                  onBlur={() => setGenderTouched(true)}
                >
                  <option value=''>Select your gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                </select>
                {genderHasError && (
                  <p className={classes.error_text}>
                    Please select your gender.
                  </p>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className={classes.section}>
              <h3 className={classes.sectionTitle}>Account Information</h3>

              <div className={getInputClasses(emailHasError)}>
                <label htmlFor='email'>Email Address *</label>
                <input
                  type='email'
                  name='email'
                  placeholder='Enter your email'
                  onChange={emailChangeHandler}
                  onBlur={emailBlurHandler}
                  value={email}
                />
                {emailHasError && (
                  <p className={classes.error_text}>
                    Please enter a valid email address.
                  </p>
                )}
              </div>

              <div className={getInputClasses(passwordHasError)}>
                <label htmlFor='password'>Password *</label>
                <div className={classes.passwordInfo}>
                  <p className={classes.passwordHint}>
                    Password must contain at least 8 characters with uppercase,
                    lowercase, and numbers
                  </p>
                </div>
                <div className={classes.passwordInput}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    placeholder='Create a strong password'
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
                    Password must contain at least 1 lowercase, 1 uppercase, 1
                    number and at least 8 characters.
                  </p>
                )}
              </div>

              <div className={getInputClasses(confirmPasswordHasError)}>
                <label htmlFor='confirmPassword'>Confirm Password *</label>
                <div className={classes.passwordInput}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name='confirmPassword'
                    placeholder='Confirm your password'
                    onChange={confirmPasswordChangeHandler}
                    onBlur={confirmPasswordBlurHandler}
                    value={confirmPassword}
                  />
                  <button
                    type='button'
                    className={classes.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
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
                {confirmPasswordHasError && (
                  <p className={classes.error_text}>Passwords do not match.</p>
                )}
              </div>
            </div>
          </div>

          <ReCaptcha
            siteKey={
              process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
              '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
            }
            action='registration'
            onVerify={handleRecaptchaVerify}
            onError={handleRecaptchaError}
          />

          <div className={classes.form_actions}>
            <button
              className={classes.button}
              type='submit'
              disabled={!formIsValid || isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
            {!formIsValid && !isSubmitting && (
              <p className={classes.helpText}>
                Please fill in all required fields to continue
              </p>
            )}
          </div>
        </form>

        <div className={classes.loginLink}>
          <p>Already have an account?</p>
          <Link to='/auth' className={classes.link}>
            Sign in here
          </Link>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
