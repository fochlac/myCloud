import Image from './Image'
import { Link } from 'react-router-dom'
import { Map } from 'immutable'
import React from 'react'
import styles from './ImageCard.less'

function ImageCard({ image, editImage, deleteImage }) {
  return (
    <Link to={`/image/${image.get('id')}`}>
      <div className={styles.card}>
        <div className={styles.toolbar}>
          <span className="fa fa-pen" onClick={() => editImage(image.get('id'))} />
          <span className="fa fa-trash" onClick={() => deleteImage(image.get('id'))} />
        </div>
        <Image image={image} size="200" />
        <div className={styles.name}>
          <p>{image.get('name')}</p>
        </div>
      </div>
    </Link>
  )
}

ImageCard.defaultProps = {
  gallery: Map(),
}

export default ImageCard
