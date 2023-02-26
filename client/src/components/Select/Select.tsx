import cn from 'classnames'
import { FocusEventHandler } from 'react'
import { default as ReactSelect, GetStyles, GroupBase } from 'react-select'

import './Select.scss'

export interface ISelectOption {
  value: string
  label: string
}

export interface ISelectProps {
  className?: string
  options: ISelectOption[]
  styles?: Partial<GetStyles<ISelectOption, false, GroupBase<ISelectOption>>>
  value: ISelectOption
  onBlur?: FocusEventHandler
  onFocus?: FocusEventHandler
  onChange?: any
}

export const Select: React.FC<ISelectProps> = ({
  className,
  options,
  styles,
  value,
  onBlur,
  onFocus,
  onChange,
}) => {
  return (
    <ReactSelect
      className={cn('Select', className)}
      options={options}
      styles={styles}
      value={value}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={onChange}
    />
  )
}
