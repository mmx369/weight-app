import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes';
import classes from './ProfileDropdown.module.css';

interface ProfileDropdownProps {
  isAuth: boolean;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (route: string) => {
    navigate(route);
    setIsOpen(false);
  };

  if (!isAuth) {
    return null;
  }

  const ProfileIcon = () => (
    <div className={classes.iconContainer}>
      <svg
        width='22'
        height='22'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={classes.profileIcon}
      >
        <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
        <circle cx='12' cy='7' r='4'></circle>
      </svg>
      <svg
        width='6'
        height='6'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={classes.dropdownArrow}
      >
        <polyline points='6,9 12,15 18,9'></polyline>
      </svg>
    </div>
  );

  return (
    <div className={classes.dropdownContainer} ref={dropdownRef}>
      <button
        className={`${classes.profileButton} ${isOpen ? classes.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title='Profile menu'
      >
        <ProfileIcon />
      </button>

      {isOpen && (
        <div className={classes.dropdownMenu}>
          <button
            className={classes.menuItem}
            onClick={() => handleMenuClick(ROUTES.DASHBOARD)}
          >
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className={classes.menuIcon}
            >
              <rect x='3' y='3' width='7' height='7'></rect>
              <rect x='14' y='3' width='7' height='7'></rect>
              <rect x='14' y='14' width='7' height='7'></rect>
              <rect x='3' y='14' width='7' height='7'></rect>
            </svg>
            Dashboard
          </button>

          <button
            className={classes.menuItem}
            onClick={() => handleMenuClick(ROUTES.PROFILE)}
          >
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className={classes.menuIcon}
            >
              <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
              <circle cx='12' cy='7' r='4'></circle>
            </svg>
            Profile
          </button>
        </div>
      )}
    </div>
  );
};
