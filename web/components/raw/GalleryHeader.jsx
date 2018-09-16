import ImageUploader from 'RAW/ImageUploader'
import ImmuTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './GalleryHeader.less'

const defaultState = {
  current: 0,
  length: 0,
}

export default class GalleryHeader extends React.Component {
  constructor() {
    super()

    this.state = defaultState
  }

  render() {
    const { gallery, uploadImages, galleryActions, isRoot } = this.props
    const { current, length } = this.state
    const canWrite = gallery.getIn(['accessToken', 'access']) === 'write'

    return (
      <div className={styles.wrapper}>
        {!!length && (
          <b className={styles.uploadInfo}>
            <p>Dateien werden verarbeitet.</p>
            <p>
              {current} von {length}
            </p>
          </b>
        )}
        <div className={styles.header}>
          <div />
          <h3 className={styles.name}>{isRoot ? 'Galerieübersicht' : gallery.get('name')}</h3>
          <div />
        </div>
        {!isRoot && <p className={styles.description}>{gallery.get('description')}</p>}
        <ul className={styles.galleryControl}>
          {!isRoot && (
            <li title="Galerie downloaden" onClick={galleryActions.zip}>
              <span className="fa fa-lg fa-download" />
            </li>
          )}
          {!isRoot &&
            canWrite && (
              <li title="Bilder hochladen">
                <ImageUploader
                  onChange={info => this.setState(info)}
                  onComplete={() => this.setState(defaultState)}
                  uploadImages={uploadImages}
                  disabled={!!length}
                >
                  <span className="fa fa-lg fa-upload" />
                </ImageUploader>
              </li>
            )}
          {(canWrite || isRoot) && (
            <li title="Galerie erstellen" onClick={galleryActions.create}>
              <span className="fa fa-lg fa-plus" />
            </li>
          )}
          {!isRoot &&
            canWrite && (
              <li title="Galerie berarbeiten" onClick={galleryActions.edit}>
                <span className="fa fa-lg fa-pencil" />
              </li>
            )}
          {!isRoot &&
            canWrite && (
              <li title="Galerie löschen" onClick={galleryActions.delete}>
                <span className="fa fa-lg fa-trash" />
              </li>
            )}
          {!isRoot &&
            canWrite && (
              <li title="Galerie teilen" onClick={galleryActions.share}>
                <span className="fa fa-lg fa-share-square-o" />
              </li>
            )}
        </ul>
      </div>
    )
  }
}

GalleryHeader.propTypes = {
  gallery: ImmuTypes.map,
  uploadImages: PropTypes.func,
  isRoot: PropTypes.bool,
  galleryActions: PropTypes.shape({
    create: PropTypes.func,
    edit: PropTypes.func,
    delete: PropTypes.func,
    share: PropTypes.func,
  }),
}

GalleryHeader.defaultProps = {
  galleryActions: {},
}
