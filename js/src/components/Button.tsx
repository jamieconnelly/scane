import className from 'classnames'
import React from 'react'

import styles from './Button.scss'

interface IProps {
  disabled?: boolean
  children: React.ReactNode
  type?: 'button' | 'submit'
  onClick?: () => any
}

const Button = ({ disabled, children, type, onClick }: IProps) => {
  const styleClasses = className(styles.button, { [styles.disabled]: disabled })
  return (
    <button
      onClick={onClick}
      className={styleClasses}
      type={type || 'button'}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
