import React from 'react'
import styles from './Image.less'

function Image({ image, size }) {
  return (
    <div className={styles.wrapper} styles={{ height: `${size}px`, width: `${size}px` }}>
      <img
        className={styles.image}
        src={`/api/images/${image.get('id')}?width=${size}&height=${size - 10}`}
      />
    </div>
  )
}

Image.defaultProps = {
  src: '',
  size: 200,
}

export default Image
