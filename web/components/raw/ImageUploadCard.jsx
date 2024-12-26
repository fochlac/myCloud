import Card from './Card'
import ImmuTypes from 'react-immutable-proptypes'
import { Map } from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './ImageUploadCard.less'

function ImageUploadCard({ image }) {
  return (
    <Card imageStyle={{ rotate: `transform: rotate(${image.get('rotate')}deg)` }} src={image.get('objectUrl')} imageTitle={image.get('name')} className={styles.card}>
      {image.get('isUploading') && (
        <div className={styles.uploading}>
          <span className="fa fa-2x fa-circle-o-notch fa-spin" />
        </div>
      )}
    </Card>
  )
}

ImageUploadCard.defaultProps = {
  image: Map(),
}

ImageUploadCard.propTypes = {
  image: ImmuTypes.shape({
    objectUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isUploading: PropTypes.bool,
  }),
}
export default ImageUploadCard
