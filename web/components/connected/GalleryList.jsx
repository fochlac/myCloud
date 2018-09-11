import {
  createGallery,
  deleteImage,
  updateImage,
  createImage,
  updateGallery,
  deleteGallery,
  createUrl,
  deleteUrl,
} from 'STORE/actions'

import CreateGalleryCard from 'RAW/CreateGalleryCard'
import DnDLayer from 'RAW/DnDLayer'
import GalleryCard from 'RAW/GalleryCard'
import ImageCard from 'RAW/ImageCard'
import DeleteGalleryDialog from 'RAW/DeleteGalleryDialog'
import ManageUrlDialog from 'RAW/ManageUrlDialog'
import Dialog from 'RAW/Dialog'
import ImageUploadCard from 'RAW/ImageUploadCard'
import ImmuTypes from 'immutable-prop-types'
import { Map } from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import style from './GalleryList.less'
import GalleryHeader from '../raw/GalleryHeader'

class GalleryList extends React.Component {
  constructor() {
    super()

    this.state = {
      dndImages: [],
      uploadQueue: Promise.resolve(),
      showCreateGallery: false,
      showManageUrl: false,
      editGallery: false,
    }

    this.handleEdit = this.handleEdit.bind(this)
    this.uploadImages = this.uploadImages.bind(this)
  }

  render() {
    const {
      elements,
      createGallery,
      deleteImage,
      gallery,
      hasParent,
      updateGallery,
      deleteGallery,
      createUrl,
      deleteUrl,
    } = this.props
    const {
      dndImages,
      showCreateGallery,
      editGallery,
      showConfirmDelete,
      showManageUrl,
    } = this.state

    const galleryActions = {
      create: () => this.setState({ showCreateGallery: true }),
      edit: () => this.setState({ showCreateGallery: true, editGallery: true }),
      delete: () => this.setState({ showConfirmDelete: true }),
      share: () => this.setState({ showManageUrl: true }),
    }

    return (
      <DnDLayer onDrop={this.uploadImages} active={hasParent}>
        <GalleryHeader
          gallery={gallery}
          uploadImages={this.uploadImages}
          isRoot={!gallery.get('id')}
          galleryActions={galleryActions}
        />
        <div className={style.list}>
          {elements
            .filter(el => !!el)
            .sort(listGalleriesFirst)
            .map(
              element =>
                isGallery(element) ? (
                  <GalleryCard key={'gal_' + element.get('id')} gallery={element} />
                ) : (
                  <ImageCard
                    key={'img_' + element.get('id')}
                    image={element}
                    editImage={this.handleEdit}
                    deleteImage={deleteImage}
                  />
                ),
            )}
          {dndImages.map(image => (
            <ImageUploadCard key={image.id} image={image} />
          ))}
        </div>
        {showCreateGallery && (
          <Dialog
            onClose={() => this.setState({ showCreateGallery: false, editGallery: false })}
            header={editGallery ? <h4>Gallerie bearbeiten</h4> : <h4>Gallerie erstellen</h4>}
          >
            <CreateGalleryCard
              onSubmit={gallery => {
                editGallery ? updateGallery(gallery) : createGallery(gallery)
                this.setState({ showCreateGallery: false, editGallery: false })
              }}
              gallery={editGallery ? gallery : undefined}
              parent={gallery.get('id')}
            />
          </Dialog>
        )}
        {showConfirmDelete && (
          <DeleteGalleryDialog
            onClose={() => this.setState({ showConfirmDelete: false })}
            onConfirm={() => {
              deleteGallery(gallery.get('id'))
              this.setState({ showConfirmDelete: false })
            }}
          />
        )}
        {showManageUrl && (
          <ManageUrlDialog
            onClose={() => this.setState({ showManageUrl: false })}
            createUrl={createUrl}
            deleteUrl={deleteUrl}
            gallery={gallery}
          />
        )}
      </DnDLayer>
    )
  }

  handleEdit(image) {
    const { updateImage } = this.props
    updateImage(image)
  }

  uploadImages(images) {
    const { gallery, createImage } = this.props
    const { dndImages, uploadQueue } = this.state
    this.setState({
      dndImages: dndImages.concat(images.map(image => ({ ...image, isUploading: true }))),
    })

    const newQueue = images.reduce((promise, image) => {
      return promise
        .then(() => {
          return createImage(image, gallery.get('id'))
        })
        .then(() => {
          const dndImages = this.state.dndImages.filter(img => image.id !== img.id)
          this.setState({ dndImages })
        })
        .catch(() => {
          const dndImages = this.state.dndImages.map(
            img =>
              image.id === img.id ? { ...img, uploadingFailed: true, isUploading: false } : img,
          )
          this.setState({ dndImages })
        })
    }, uploadQueue)

    this.setState({ uploadQueue: newQueue })
  }
}

GalleryList.propTypes = {
  elements: ImmuTypes.list.isRequired,
  gallery: ImmuTypes.map,
  hasParent: PropTypes.bool,
  createGallery: PropTypes.func.isRequired,
  createImage: PropTypes.func.isRequired,
  deleteImage: PropTypes.func.isRequired,
  updateImage: PropTypes.func.isRequired,
  updateGallery: PropTypes.func.isRequired,
  deleteGallery: PropTypes.func.isRequired,
  createUrl: PropTypes.func.isRequired,
  deleteUrl: PropTypes.func.isRequired,
}

GalleryList.defaultProps = {
  gallery: Map(),
}

export default connect(
  (state, ownProps) => ({
    hasParent:
      !!ownProps.gallery &&
      !!ownProps.gallery.get('id') &&
      !!state.getIn(['galleries', ownProps.gallery.get('id')]),
  }),
  {
    deleteImage,
    updateImage,
    createGallery,
    createImage,
    updateGallery,
    deleteGallery,
    createUrl,
    deleteUrl,
  },
)(GalleryList)

function listGalleriesFirst(a, b) {
  if (isGallery(a) === isGallery(b)) {
    return 0
  }
  return isGallery(a) ? -1 : 1
}

function isGallery(element) {
  return !!element.get('images')
}
