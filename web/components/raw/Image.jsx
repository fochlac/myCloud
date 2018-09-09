import React from 'react'
import styles from './Image.less'

function Image({ image, size, src }) {
  return (
    <div className={styles.wrapper} style={{ height: `${size}px`, width: `${size}px` }}>
      { image ? <img
        style={{ maxHeight: `${size}px`, maxWidth: `${size}px` }}
        className={styles.image}
        src={src || `/api/images/${image.get('id')}?width=${size}&height=${size - 10}`}
      /> : <span className={`fa fa-image ${styles.placeholder}`}></span>}
    </div>
  )
}

Image.defaultProps = {
  size: 200,
  src: null
}

export default Image
