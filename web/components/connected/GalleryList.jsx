import { createGallery, deleteImage, updateImage } from 'STORE/actions'

import CreateGalleryCard from 'RAW/CreateGalleryCard'
import DnDLayer from 'RAW/DnDLayer'
import GalleryCard from 'RAW/GalleryCard'
import ImageCard from 'RAW/ImageCard'
import ImageUploader from 'CONNECTED/ImageUploader'
import ImmuTypes from 'immutable-prop-types'
import { Map } from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import style from './GalleryList.less'

class GalleryList extends React.Component {
  constructor() {
    super()

    this.state = {
      isImageUploaderOpen: false,
      dndImages: [],
    }

    this.handleEdit = this.handleEdit.bind(this)
  }

  render() {
    const { elements, createGallery, deleteImage, gallery } = this.props
    const { isImageUploaderOpen, dndImages } = this.state

    return (
      <DnDLayer
        className={style.list}
        onDrop={newImages =>
          this.setState({ isImageUploaderOpen: true, dndImages: dndImages.concat(newImages) })
        }
      >
        <CreateGalleryCard createGallery={createGallery} parent={gallery.get('id')} />
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
        {isImageUploaderOpen && (
          <ImageUploader
            dndImages={dndImages}
            closeDialog={() => this.setState({ isImageUploaderOpen: false, dndImages: [] })}
          />
        )}
      </DnDLayer>
    )
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
  gallery: Map(),
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
