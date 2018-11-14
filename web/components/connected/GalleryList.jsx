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
import Pager from 'RAW/Pager'
import PropTypes from 'prop-types'
import React from 'react'
import ZipDialog from 'RAW/ZipDialog'
import { connect } from 'react-redux'
import { requestFullscreen } from 'UTILS/fullscreen'
import { setFullscreen } from 'STORE/actions/app'
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

    this.galleryActions = {
      zip: () => this.setState({ showCreateZip: true }),
      create: () => this.setState({ showCreateGallery: true }),
      edit: () => this.setState({ showCreateGallery: true, editGallery: true }),
      delete: () => this.setState({ showConfirmDelete: true }),
      share: () => this.setState({ showManageUrl: true }),
    }
    this.handleResize = this.handleResize.bind(this)
    this.handleOpenSlideshow = this.handleOpenSlideshow.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize() {
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(() => {
      this.forceUpdate()
    }, 300)
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
      location,
    } = this.props
    const {
      showCreateGallery,
      editGallery,
      showConfirmDelete,
      showManageUrl,
      showCreateZip,
    } = this.state

    const size =
      Math.floor((window.outerWidth - 50) / 180) * Math.floor((window.outerHeight - 200) / 220) || 1

    const active = location.search.split('active=')[1]
      ? location.search.split('active=')[1].split('&')[0]
      : 1

    return (
      <DnDLayer onDrop={this.uploadImages} active={hasParent}>
        <GalleryHeader
          gallery={gallery}
          uploadImages={this.uploadImages}
          isRoot={!gallery.get('id')}
          galleryActions={this.galleryActions}
          busy={busy}
        />
        <Pager
          size={size}
          activeItem={+active}
          key={gallery.get('id') || 'root'}
          wrapper={children => <div className={style.list}>{children}</div>}
          onChange={index =>
            window.history.replaceState('', '', `/gallery/${gallery.get('id')}?active=${index}`)
          }
        >
          {elements
            .filter(el => !!el)
            .sort(listGalleriesFirst)
            .map(element =>
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
                  onClick={this.handleOpenSlideshow}
                />
              ),
            )
            .concat(
              (queue.get('images') &&
                queue
                  .get('images')
                  .map(image => <ImageUploadCard key={image.get('id')} image={image} />)) ||
                [],
            )}
        </Pager>
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

  handleOpenSlideshow(evt) {
    if (window.outerHeight < 700 || window.outerWidth < 700) {
      requestFullscreen()
      this.props.setFullscreen(true)
    }
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
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
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
  setFullscreen: PropTypes.func.isRequired,
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
        setFullscreen,
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
    gallery.getIn(['images', 0]) ||
    gallery
      .get('children')
      .flatMap(id => galleries.getIn([id, 'images']))
      .get(0)
  )
}
