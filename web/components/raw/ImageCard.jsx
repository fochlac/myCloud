import Card from './Card'
import { Link } from 'react-router-dom'
import React from 'react'
import styles from './ImageCard.less'
import PropTypes from 'prop-types'
import ImmuTypes from 'immutable-prop-types'
import { Map } from 'immutable';

function ImageCard({ image, editImage, deleteImage }) {
  return (
    <Link to={`/image/${image.get('id')}`}>
      <Card image={image} className={styles.card}>
        <div className={styles.toolbar}>
          <span className="fa fa-pencil" onClick={prevent(editImage, image)} />
          <span className="fa fa-trash" onClick={prevent(deleteImage, image)} />
        </div>
      </Card>
    </Link>
  )
}

ImageCard.defaultProps = {
  image: Map()
}

ImageCard.propTypes = {
  image: ImmuTypes.map,
  editImage: PropTypes.func,
  deleteImage: PropTypes.func,
}
export default ImageCard


function prevent(fn, arg) {
  return evt => {
    evt.stopPropagation()
    evt.preventDefault()
    fn(arg)
  }
}
