import React from 'react'
import styles from './Image.less'

function Image({ image, size }) {
  return (
    <div className={styles.wrapper} styles={{ height: `${size}px`, width: `${size}px` }}>
      { image ? <img
        className={styles.image}
        src={`/api/images/${image.get('id')}?width=${size}&height=${size - 10}`}
      /> : <span className="fa fa-image"></span>}
    </div>
  )
}

Image.defaultProps = {
  size: 200,
}

export default Image
