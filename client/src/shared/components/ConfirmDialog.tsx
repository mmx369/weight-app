import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classes from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={classes.confirmOverlay}>
      <div className={classes.confirmDialog}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={classes.confirmButtons}>
          <button className={classes.confirmBtnCancel} onClick={onCancel}>
            Cancel
          </button>
          <button className={classes.confirmBtnConfirm} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export const showConfirmDialog = (
  title: string,
  message: string,
  onConfirm: () => void
): void => {
  const ConfirmComponent = () => {
    const [isOpen, setIsOpen] = useState(true);

    const handleConfirm = () => {
      setIsOpen(false);
      onConfirm();
    };

    const handleCancel = () => {
      setIsOpen(false);
    };

    return (
      <ConfirmDialog
        isOpen={isOpen}
        title={title}
        message={message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  };

  toast(<ConfirmComponent />, {
    position: 'top-center',
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    closeButton: false,
  });
};

export default ConfirmDialog;
