import {
  createGallery,
  createImage,
  createUrl,
  deleteGallery,
  deleteImage,
  deleteUrl,
  updateGallery,
  updateImage,
} from 'STORE/actions'

import CreateGalleryCard from 'RAW/CreateGalleryCard'
import DeleteGalleryDialog from 'RAW/DeleteGalleryDialog'
import Dialog from 'RAW/Dialog'
import DnDLayer from 'RAW/DnDLayer'
import GalleryCard from 'RAW/GalleryCard'
import GalleryHeader from 'RAW/GalleryHeader'
import ImageCard from 'RAW/ImageCard'
import ImageUploadCard from 'RAW/ImageUploadCard'
import ImmuTypes from 'react-immutable-proptypes'
import ManageUrlDialog from 'RAW/ManageUrlDialog'
import { Map } from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import ZipDialog from 'RAW/ZipDialog'
import { connect } from 'react-redux'
import { sortImages } from 'UTILS/sortImages'
import style from './GalleryList.less'
import uploadQueue from 'CONNECTED/UploadQueue'
import { withRouter } from 'react-router-dom'

class GalleryList extends React.Component {
  constructor() {
    super()

    this.state = {
      showCreateGallery: false,
      showManageUrl: false,
      editGallery: false,
      showCreateZip: false,
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
      history,
      queue,
      busy,
      galleries,
    } = this.props
    const {
      showCreateGallery,
      editGallery,
      showConfirmDelete,
      showManageUrl,
      showCreateZip,
    } = this.state

    const galleryActions = {
      zip: () => this.setState({ showCreateZip: true }),
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
          busy={busy}
        />
        <div className={style.list}>
          {elements
            .filter(el => !!el)
            .sort(listGalleriesFirst)
            .map(
              element =>
                isGallery(element) ? (
                  <GalleryCard
                    key={'gal_' + element.get('id')}
                    gallery={element}
                    image={getGalleryImage(element, galleries)}
                  />
                ) : (
                  <ImageCard
                    key={'img_' + element.get('id')}
                    image={element}
                    editImage={this.handleEdit}
                    deleteImage={deleteImage}
                  />
                ),
            )}
          {queue.get('images') &&
            queue
              .get('images')
              .map(image => <ImageUploadCard key={image.get('id')} image={image} />)}
        </div>
        {showCreateGallery && (
          <Dialog
            onClose={() => this.setState({ showCreateGallery: false, editGallery: false })}
            header={editGallery ? <h4>Galerie bearbeiten</h4> : <h4>Galerie erstellen</h4>}
          >
            <CreateGalleryCard
              onClose={() => this.setState({ showCreateGallery: false, editGallery: false })}
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
              history.push(gallery.get('parent') ? `/gallery/${gallery.get('parent')}` : '/')
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
        {showCreateZip && (
          <ZipDialog onClose={() => this.setState({ showCreateZip: false })} gallery={gallery} />
        )}
      </DnDLayer>
    )
  }

  uploadImages(images) {
    const { gallery, uploadImages } = this.props

    uploadImages(images, gallery)
  }

  handleEdit(image) {
    const { updateImage } = this.props
    updateImage(image)
  }
}

GalleryList.propTypes = {
  elements: ImmuTypes.list.isRequired,
  gallery: ImmuTypes.map,
  galleries: ImmuTypes.map,
  hasParent: PropTypes.bool,
  createGallery: PropTypes.func.isRequired,
  createImage: PropTypes.func.isRequired,
  deleteImage: PropTypes.func.isRequired,
  updateImage: PropTypes.func.isRequired,
  updateGallery: PropTypes.func.isRequired,
  deleteGallery: PropTypes.func.isRequired,
  createUrl: PropTypes.func.isRequired,
  deleteUrl: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  uploadImages: PropTypes.func.isRequired,
  queue: ImmuTypes.map,
  busy: ImmuTypes.list,
}

GalleryList.defaultProps = {
  galleries: Map(),
  gallery: Map(),
  queue: Map(),
}

export default uploadQueue(
  withRouter(
    connect(
      (state, ownProps) => ({
        hasParent:
          !!ownProps.gallery &&
          !!ownProps.gallery.get('id') &&
          !!state.getIn(['galleries', ownProps.gallery.get('id')]),
        queue: ownProps.gallery && state.getIn(['uploadQueue', ownProps.gallery.get('id')]),
        busy: state.getIn(['app', 'busy']),
        galleries: state.get('galleries'),
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
    )(GalleryList),
  ),
)

function listGalleriesFirst(a, b) {
  if (isGallery(a) === isGallery(b)) {
    return isGallery(a) ? 0 : sortImages(a, b)
  }
  return isGallery(a) ? -1 : 1
}

function isGallery(element) {
  return !!element.get('images')
}

function getGalleryImage(gallery, galleries) {
  return (
    gallery.get('images')[0] ||
    gallery.children.map(id => galleries.getIn([id, 'images'])).flatten(0)[0]
  )
}
