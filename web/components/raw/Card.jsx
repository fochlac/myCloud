import Image from 'CONNECTED/Image'
import ImmuTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './Card.less'

export default function Card({ children, image, imageTitle, className, src }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card + ' ' + className}>
        <Image image={image} src={src} size={140} title={imageTitle} />
        <div className={styles.name}>{children}</div>
      </div>
    </div>
  )
}

Card.propTypes = {
  image: ImmuTypes.map,
  className: PropTypes.string,
  imageTitle: PropTypes.string,
  src: PropTypes.string,
  children: PropTypes.any,
}
