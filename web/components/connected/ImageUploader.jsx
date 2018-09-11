import React from 'react'
import { connect } from 'react-redux'
import { addBusy, removeBusy } from 'STORE/actions'
import styles from './ImageUploader.less'
import { createSmallObjectURL } from '../../utils/resizer'
import PropTypes from 'prop-types'

export class ImageUploader extends React.Component {
  handleNewFile(evt) {
    const { uploadImages, addBusy, busyTarget, removeBusy } = this.props
    const files = evt.target.files
    addBusy(busyTarget)
    Promise.all(
      Array.from(files).map(async file => ({
        file,
        name: file.name,
        created: file.lastModified,
        objectUrl: await createSmallObjectURL(file),
        id: `${file.lastModified}_${file.size}`,
      })),
    )
      .then(files => {
        uploadImages(files)
        removeBusy(busyTarget)
      })
      .catch(() => {
        removeBusy(busyTarget)
      })
  }

  render() {
    const { children } = this.props
    return (
      <div className={styles.uploadWrapper}>
        {children}
        <input
          type="file"
          name="Image"
          accept="image/*"
          multiple
          className={styles.input}
          value=""
          onChange={evt => this.handleNewFile(evt)}
        />
      </div>
    )
  }
}


ImageUploader.propTypes = {
  children: PropTypes.any,
  uploadImages: PropTypes.func,
  addBusy: PropTypes.func,
  removeBusy: PropTypes.func,
  busyTarget: PropTypes.string
}

export default connect(
  () => ({}),
  dispatch => ({ addBusy, removeBusy }),
)(ImageUploader)
