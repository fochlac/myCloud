import React from 'react'
import styles from './ButtonBar.less'
import PropTypes from 'prop-types'

export default function ButtonBar({ buttons }) {
  return (
    <div className={styles.buttonBar}>
      {buttons.map(({ text, onClick, type }, index) => (
        <button key={index} className={styles[type]} onClick={onClick}>
          {text}
        </button>
      ))}
    </div>
  )
}

ButtonBar.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['secondary', 'destructive']),
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  ),
}
