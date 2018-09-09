import ImmuTypes from 'immutable-prop-types'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './Image.less'

function Image({ image, size, src, title, width, height, background }) {
  const url =
    image &&
    (src ||
      `/api/images/${image.get('id')}?width=${width || size - 10}&height=${height || size - 10}`)

  return (
    <div
      className={styles.wrapper}
      style={{ height: `${height || size}px`, width: `${width || size}px`, background }}
    >
      {image ? (
        <img
          style={{ maxHeight: `${height || size}px`, maxWidth: `${width || size}px` }}
          className={styles.image}
          title={title}
          src={url}
        />
      ) : (
        <span className={`fa fa-image ${styles.placeholder}`} />
      )}
    </div>
  )
}

Image.defaultProps = {
  size: 200,
  src: null,
  title: '',
  background: 'white',
}

Image.propTypes = {
  image: ImmuTypes.map,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  src: PropTypes.string,
  title: PropTypes.string,
  background: PropTypes.string,
}

export default Image
