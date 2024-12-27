import Image from 'CONNECTED/Image'
import ImmuTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './Card.less'

export default function Card({ children, onClick, image, size = 140, imageTitle, className, src, noWrapper, imageStyle, showChildren }) {
  const card = (
    <div onClick={onClick} className={styles.card + ' ' + className}>
      <Image style={imageStyle} image={image} src={src} size={size} height={showChildren ? 110 : size} title={imageTitle} />
      <div className={showChildren ? styles.name : styles.nameHidden}>{children}</div>
    </div>
  )

  return noWrapper ? card : <div className={styles.wrapper}>{card}</div>
}

Card.propTypes = {
  image: ImmuTypes.map,
  className: PropTypes.string,
  imageTitle: PropTypes.string,
  showChildren: PropTypes.bool,
  src: PropTypes.string,
  children: PropTypes.any,
}
