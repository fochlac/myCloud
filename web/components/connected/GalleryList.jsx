import GalleryCard from 'RAW/GalleryCard'
import ImageCard from 'RAW/ImageCard'
import React from 'react'
import PropTypes from 'prop-types'
import ImmuTypes from 'immutable-prop-types'
import { connect } from 'react-redux'
import style from './GalleryList.less'
import { createGallery, deleteImage, updateImage } from 'STORE/actions'
import CreateGalleryCard from 'RAW/CreateGalleryCard'
import ImageUploader from 'CONNECTED/ImageUploader'
import { Map } from 'immutable'

class GalleryList extends React.Component {
  constructor() {
    super()

    this.state = {
      dragging: false,
    }

    this.handleEdit = this.handleEdit.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragStop = this.onDragStop.bind(this)
  }

  componentDidMount() {
    document.addEventListener('dragexit', this.onDragStop)
    document.addEventListener('mouseover', this.onDragStop)
  }
  componentWillUnmount() {
    document.removeEventListener('dragexit', this.onDragStop)
    document.removeEventListener('mouseover', this.onDragStop)

  }

  render() {
    const { elements, createGallery, deleteImage, gallery } = this.props
    const { dragging } = this.state

    return <section className={style.list} onDragEnter={this.onDragStart} onDrop={this.onDragStop}>
        <CreateGalleryCard createGallery={createGallery} parent={gallery.get('id')} />
        {gallery.get('id') && <ImageUploader parent={gallery.get('id')} dragging={dragging} />}
        {elements
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
      </section>
  }

  onDragStart() {
    this.setState({ dragging: true })
    this.isDragging = true
  }

  onDragStop() {
    if (!this.isDragging) return
    this.setState({ dragging: false })
    this.isDragging = false
  }

  handleEdit(image) {
    const { updateImage } = this.props
    updateImage(image)
  }
}

GalleryList.propTypes = {
  elements: ImmuTypes.list.isRequired,
  gallery: ImmuTypes.map,
  createGallery: PropTypes.func.isRequired,
  deleteImage: PropTypes.func.isRequired,
  updateImage: PropTypes.func.isRequired,
}

GalleryList.defaultProps = {
  gallery: Map()
}

export default connect(
  () => ({}),
  { deleteImage, updateImage, createGallery },
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
