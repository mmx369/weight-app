import React, { ReactNode } from 'react'
import classes from './Modal.module.css'

interface IModalProps {
  show: boolean
  children?: ReactNode
}

export const Modal: React.FC<IModalProps> = ({ show, children }) => {
  if (!show) {
    return null
  }

  return (
    <div className={classes.modal_backdrop}>
      <div className={classes.modal}>{children}</div>
    </div>
  )
}
