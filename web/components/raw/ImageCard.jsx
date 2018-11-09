import Card from './Card'
import { ImageType } from '../../types/api-types'
import { Link } from 'react-router-dom'
import { Map } from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './ImageCard.less'

function ImageCard({ image, editImage, deleteImage, onClick }) {
  return (
    <Link
      to={`/gallery/${image.get('gallery')}/slideshow?image=${image.get('id')}`}
      onClick={onClick}
    >
      <Card image={image} imageTitle={image.get('name')} className={styles.card}>
        <div className={styles.toolbar}>
          {/* <span className="fa fa-pencil" onClick={prevent(editImage, image)} /> */}
          <span className="fa fa-trash" onClick={prevent(deleteImage, image)} />
        </div>
      </Card>
    </Link>
  )
}

ImageCard.defaultProps = {
  image: Map(),
}

ImageCard.propTypes = {
  image: ImageType,
  editImage: PropTypes.func,
  deleteImage: PropTypes.func,
  onClick: PropTypes.func,
}
export default ImageCard

function prevent(fn, arg) {
  return evt => {
    evt.stopPropagation()
    evt.preventDefault()
    fn(arg)
  }
}
