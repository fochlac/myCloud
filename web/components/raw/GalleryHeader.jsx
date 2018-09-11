import ImmuTypes from 'immutable-prop-types'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './GalleryHeader.less'
import { GALLERY } from '../views/Gallery'
import ImageUploader from 'CONNECTED/ImageUploader'

export default function GalleryHeader({ gallery, uploadImages, galleryActions, isRoot }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div />
        <h3 className={styles.name}>{isRoot ? 'Gallerieübersicht' : gallery.get('name')}</h3>
        <div />
      </div>
      {!isRoot && <p className={styles.description}>{gallery.get('description')}</p>}
      <ul className={styles.galleryControl}>
        {!isRoot && (
          <li title="Bilder hochladen">
            <ImageUploader busyTarget={GALLERY} uploadImages={uploadImages}>
              <span className="fa fa-lg fa-upload" />
            </ImageUploader>
          </li>
        )}
        <li title="Gallerie erstellen" onClick={galleryActions.create}>
          <span className="fa fa-lg fa-plus" />
        </li>
        {!isRoot && [
          <li key={1} title="Gallerie berarbeiten" onClick={galleryActions.edit}>
            <span className="fa fa-lg fa-pencil" />
          </li>,
          <li key={2} title="Gallerie löschen" onClick={galleryActions.delete}>
            <span className="fa fa-lg fa-trash" />
          </li>,
          <li key={3} title="Gallerie teilen" onClick={galleryActions.share}>
            <span className="fa fa-lg fa-share-square-o" />
          </li>,
        ]}
      </ul>
    </div>
  )
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
