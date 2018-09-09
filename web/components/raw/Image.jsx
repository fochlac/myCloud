import React from 'react'
import styles from './Image.less'
import PropTypes from 'prop-types'
import ImmuTypes from 'immutable-prop-types'

function Image({ image, size, src, title }) {
  return (
    <div className={styles.wrapper} style={{ height: `${size}px`, width: `${size}px` }}>
      { image ? <img
        style={{ maxHeight: `${size}px`, maxWidth: `${size}px` }}
        className={styles.image}
        title={title}
        src={src || `/api/images/${image.get('id')}?width=${size}&height=${size - 10}`}
      /> : <span className={`fa fa-image ${styles.placeholder}`}></span>}
    </div>
  )
}

Image.defaultProps = {
  size: 200,
  src: null,
  title: ''
}

Image.propTypes= {
  image: ImmuTypes.map,
  size: PropTypes.number,
  src: PropTypes.string,
  title: PropTypes.string
}

export default Image
