import React from 'react';
import classes from './Loader.module.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullscreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  message,
  fullscreen = false,
}) => {
  return (
    <div
      className={`${classes.loaderContainer} ${
        fullscreen ? classes.fullscreen : ''
      }`}
    >
      <div className={`${classes.loader} ${classes[size]}`}>
        <div className={classes.spinner}>
          <div className={classes.ring}></div>
          <div className={classes.ring}></div>
          <div className={classes.ring}></div>
        </div>
        {message && <div className={classes.message}>{message}</div>}
      </div>
    </div>
  );
};

export default Loader;
