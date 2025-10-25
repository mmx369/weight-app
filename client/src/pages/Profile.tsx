import { useContext, useState } from 'react';

import { Context } from '..';
import ProfileForm from '../modules/ProfileForm';
import Button from '../shared/UI/Button';
import Modal from '../shared/UI/Modal';
import { Loader } from '../shared/components';
import { useAuth } from '../shared/hooks/use-auth';
import classes from './Profile.module.css';

export const Profile: React.FC = () => {
  const { store } = useContext(Context);
  const { isLoading, isAuth } = useAuth();

  const [isModalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className={classes.container}>
        <Loader size='large' />
      </div>
    );
  }

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = () => {
    openModal();
  };

  const handleSubmitData = () => {
    closeModal();
  };

  // Format date to readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Add ordinal suffix to day
    const getOrdinalSuffix = (day: number) => {
      if (day >= 11 && day <= 13) return 'th';
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    return `${month} ${day}${getOrdinalSuffix(day)} ${year}`;
  };

  // Format registration date
  const formatRegistrationDate = () => {
    if (!store.user.createdAt) return 'Not available';
    return formatDate(store.user.createdAt.toString());
  };

  return isAuth ? (
    <div className={classes.container}>
      <div className={classes.profileCard}>
        <h1 className={classes.title}>Profile Information</h1>

        <div className={classes.profileInfo}>
          <div className={classes.infoRow}>
            <span className={classes.label}>First Name:</span>
            <span className={classes.value}>
              {store.user.firstName || 'Not specified'}
            </span>
          </div>

          <div className={classes.infoRow}>
            <span className={classes.label}>Last Name:</span>
            <span className={classes.value}>
              {store.user.familyName || 'Not specified'}
            </span>
          </div>

          <div className={classes.infoRow}>
            <span className={classes.label}>Date of Birth:</span>
            <span className={classes.value}>
              {formatDate(store.user.dateOfBirth?.toString())}
            </span>
          </div>

          <div className={classes.infoRow}>
            <span className={classes.label}>Height:</span>
            <span className={classes.value}>
              {store.user.height ? `${store.user.height} cm` : 'Not specified'}
            </span>
          </div>

          <div className={classes.infoRow}>
            <span className={classes.label}>Gender:</span>
            <span className={classes.value}>
              {store.user.gender
                ? store.user.gender.charAt(0).toUpperCase() +
                  store.user.gender.slice(1)
                : 'Not specified'}
            </span>
          </div>

          <div className={classes.infoRow}>
            <span className={classes.label}>Registration Date:</span>
            <span className={classes.value}>{formatRegistrationDate()}</span>
          </div>
        </div>

        <div className={classes.actions}>
          <Button
            typeButton='submit'
            className='btn_save'
            onClick={handleSubmit}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <Modal show={isModalOpen}>
        <ProfileForm
          onClose={closeModal}
          firstName={store.user.firstName}
          familyName={store.user.familyName}
          dateOfBirth={
            store.user.dateOfBirth
              ? new Date(store.user.dateOfBirth).toISOString().split('T')[0]
              : ''
          }
          height={store.user.height}
        />
      </Modal>
    </div>
  ) : null;
};
