import Dialog from 'RAW/Dialog'
import Image from 'RAW/Image'
import InputRow from 'RAW/InputRow'
import React from 'react'
import { connect } from 'react-redux'
import { createImage } from 'STORE/actions'
import cx from '../../utils/classnames'
import styles from './ImageUploader.less'

export class ImageUploader extends React.Component {
  constructor(props) {
    super()
    this.state = {
      dndImages: props.dndImages,
      allImages: props.dndImages,
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { dndImages } = this.props
    const { allImages } = this.state
    if (dndImages !== nextProps.dndImages) {
      const imageIds = allImages.map(({ id }) => id)
      const changedImages = nextProps.dndImages.filter(({ id }) => !imageIds.includes(id))
      this.setState({ dndImages: nextProps.dndImages, allImages: allImages.concat(changedImages) })
    }
  }

  handleNewFile(evt) {
    const files = Array.from(evt.target.files).map(file => ({
      file,
      name: file.name,
      created: file.lastModified,
      objectUrl: URL.createObjectURL(file),
      id: `${file.lastModified}_${file.size}`,
    }))

    this.setState({ allImages: this.state.allImages.concat(files) })
  }

  render() {
    const { allImages } = this.state
    const { closeDialog } = this.props
    return (
      <Dialog closeOnBackdrop closeDialog={closeDialog}>
        <div className={styles.header}>
          <h4>Bilder hochladen</h4>
          <span className={cx('fa fa-times', styles.closeButton)} onClick={closeDialog} />
        </div>
        <div className={styles.list}>
          {allImages.map((image, index) => (
            <div key={index} className={cx(styles.card, !!image.isUploaded && styles.success)}>
              {image.isUploading && (
                <div className={styles.uploading}>
                  <span className="fa fa-2x fa-circle-o-notch fa-spin" />
                </div>
              )}
              <div className={styles.toolbar}>
                <span className="fa fa-trash" onClick={() => this.deleteImage(index)} />
              </div>
              <Image src={image.objectUrl} width={100} height={100} />
              <InputRow
                label="name"
                defaultValue={image.name}
                onBlur={value => this.updateImage(index, 'name', value)}
              />
            </div>
          ))}
        </div>
        <div className={styles.uploadWrapper}>
          <button>Bilder hinzufügen</button>
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
        <button onClick={this.onSubmit}>Upload!</button>
      </Dialog>
    )
  }

  deleteImage(delIndex) {
    this.setState({
      allImages: this.state.allImages.filter((img, index) => index !== delIndex),
    })
  }

  updateImage(index, key, value) {
    const newImages = this.state.allImages.concat([])
    newImages[index] = {
      ...newImages[index],
      [key]: value,
    }

    this.setState({ allImages: newImages })
  }

  onSubmit() {
    const { parent } = this.props
    const { allImages } = this.state
    this.setState({ allImages: allImages.map(image => ({ ...image, isUploading: true })) })

    allImages.reduce((promise, image) => {
      return promise
        .then(() => {
          return createImage(image, parent)
        })
        .then(() => {
          const allImages = this.state.allImages.map(
            img => (image.id === img.id ? { ...img, isUploaded: true, isUploading: false } : img),
          )
          this.setState({ allImages })
        })
        .catch(() => {
          const allImages = this.state.allImages.map(
            img =>
              image.id === img.id ? { ...img, uploadingFailed: true, isUploading: false } : img,
          )
          this.setState({ allImages })
        })
    }, Promise.resolve())
  }
}

ImageUploader.defaultProps = {
  dndImages: [],
}

export default connect(
  () => ({}),
  dispatch => ({ createImage: (file, parent) => dispatch(createImage(file, parent)) }),
)(ImageUploader)
