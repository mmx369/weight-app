import classNames from 'classnames'
import React, { DOMAttributes } from 'react'

import classes from './Button.module.css'

let cx = classNames.bind(classes)

export type ButtonType = 'button' | 'submit' | 'reset'

export interface IButtonProps extends DOMAttributes<HTMLButtonElement> {
  className?: string
  isDisabled?: boolean
  typeButton?: ButtonType
  onClick?: (e: React.MouseEvent) => void
}

export const Button: React.FC<IButtonProps> = ({
  className,
  children,
  isDisabled,
  typeButton,
  onClick,
  ...props
}) => {
  return (
    <button
      className={cx('Button', className, { Button__disabled: isDisabled })}
      disabled={isDisabled}
      type={typeButton}
      onClick={onClick}
      {...props}
    >
      <span>{children}</span>
    </button>
  )
}
