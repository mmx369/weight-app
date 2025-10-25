import { useEffect, useState } from 'react';
import WeightService from '../../services/WeightService';
import Button from '../../shared/UI/Button';
import classes from './ProfileForm.module.css';

interface IProfileFormProps {
  onClose: () => void;
  firstName?: string;
  familyName?: string;
  dateOfBirth?: string;
  height?: number;
}

interface IProfileData {
  firstName: string;
  familyName: string;
  dateOfBirth: string;
  height: number;
}

export const ProfileForm: React.FC<IProfileFormProps> = ({
  onClose,
  firstName,
  familyName,
  dateOfBirth,
  height,
}) => {
  const [profileData, setProfileData] = useState<IProfileData>({
    firstName: '',
    familyName: '',
    dateOfBirth: '',
    height: 0,
  });

  useEffect(() => {
    setProfileData({
      firstName: firstName || '',
      familyName: familyName || '',
      dateOfBirth: dateOfBirth || '',
      height: height || 0,
    });
  }, [firstName, familyName, dateOfBirth, height]);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    await WeightService.modifyProfileData(profileData);
    onClose();
  };

  return (
    <div className={classes.modalContent}>
      <div className={classes.header}>
        <h3 className={classes.title}>Edit Profile</h3>
        <button className={classes.closeButton} onClick={onClose}>
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <line x1='18' y1='6' x2='6' y2='18'></line>
            <line x1='6' y1='6' x2='18' y2='18'></line>
          </svg>
        </button>
      </div>

      <form className={classes.form}>
        <div className={classes.formGroup}>
          <label htmlFor='firstName' className={classes.label}>
            First Name
          </label>
          <input
            className={classes.input}
            placeholder='Enter your first name'
            id='firstName'
            type='text'
            name='firstName'
            value={profileData.firstName}
            onChange={(e) =>
              setProfileData({ ...profileData, firstName: e.target.value })
            }
          />
        </div>

        <div className={classes.formGroup}>
          <label htmlFor='familyName' className={classes.label}>
            Last Name
          </label>
          <input
            className={classes.input}
            placeholder='Enter your last name'
            id='familyName'
            type='text'
            name='familyName'
            value={profileData.familyName}
            onChange={(e) =>
              setProfileData({ ...profileData, familyName: e.target.value })
            }
          />
        </div>

        <div className={classes.formGroup}>
          <label htmlFor='dateOfBirth' className={classes.label}>
            Date of Birth
          </label>
          <input
            className={classes.input}
            id='dateOfBirth'
            type='date'
            name='dateOfBirth'
            value={profileData.dateOfBirth}
            onChange={(e) =>
              setProfileData({ ...profileData, dateOfBirth: e.target.value })
            }
          />
        </div>

        <div className={classes.formGroup}>
          <label htmlFor='height' className={classes.label}>
            Height (cm)
          </label>
          <input
            className={classes.input}
            placeholder='Enter your height'
            id='height'
            type='number'
            name='height'
            min='100'
            max='250'
            step='1'
            value={profileData.height || ''}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                height: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>

        <div className={classes.actions}>
          <Button
            typeButton='submit'
            className='btn_save'
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
          <button
            type='button'
            className={classes.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
