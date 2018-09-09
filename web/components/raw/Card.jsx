import React from 'react'
import Image from './Image'
import styles from './Card.less'
import PropTypes from 'prop-types'
import ImmuTypes from 'immutable-prop-types'

export default function Card({ children, image, imageTitle, className }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card + ' ' + className}>
        <Image image={image} size="140" title={imageTitle} />
        <div className={styles.name}>{children}</div>
      </div>
    </div>
  )
}

Card.propTypes = {
  image: ImmuTypes.map,
  className: PropTypes.string,
  imageTitle: PropTypes.string,
  children: PropTypes.any,
}
