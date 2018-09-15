import React from 'react'
import styles from './ImageUploader.less'
import { createSmallObjectURL } from '../../utils/resizer'
import PropTypes from 'prop-types'

export default class ImageUploader extends React.Component {
  handleNewFile(evt) {
    const { uploadImages, onChange, onComplete } = this.props
    const files = Array.from(evt.target.files)

    onChange({ length: files.length, current: 0 })
    Promise.all(
      files.reduce((promises, file, index) => {
        const oldPromise = promises[0] || Promise.resolve()

        promises.unshift(
          oldPromise.then(async () => {
            onChange({ length: files.length, current: index + 1 })

            return {
              file,
              name: file.name,
              created: Date.now(),
              objectUrl: await createSmallObjectURL(file),
              id: `${file.lastModified}_${file.size}`,
            }
          }),
        )
        return promises
      }, []),
    )
      .then(files => {
        uploadImages(files)
        onComplete()
      })
      .catch(() => {
        onComplete()
      })
  }

  render() {
    const { children, disabled } = this.props
    return (
      <div className={styles.uploadWrapper}>
        {children}
        <input
          type="file"
          name="Image"
          accept="image/*"
          disabled={disabled}
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
  onComplete: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}
