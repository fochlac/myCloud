import React from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'
import { updateQueue, createImage } from 'STORE/actions'
import ImmuTypes from 'immutable-prop-types'
import PropTypes from 'prop-types'

const propTypes = {
  queue: ImmuTypes.map.isRequired,
  createImage: PropTypes.func.isRequired,
  updateQueue: PropTypes.func.isRequired,
}

export default function uploadQueue(Component) {
  class UploadQueue extends React.Component {
    render() {
      return <Component uploadImages={this.uploadImages.bind(this)} {...this.props} />
    }

    uploadImages(images, gallery) {
      const { queue, updateQueue, createImage } = this.props

      let galleryQueue =
        queue.get(gallery.get('id')) || fromJS({ promise: Promise.resolve(), images: [] })

      galleryQueue = galleryQueue.set(
        'images',
        galleryQueue
          .get('images')
          .concat(fromJS(images.map(image => ({ ...image, isUploading: true })))),
      )

      galleryQueue = galleryQueue.set(
        'promise',
        images.reduce((promise, image) => {
          return promise.then(() => {
            return createImage(image, gallery.get('id'))
          })
        }, galleryQueue.get('promise')),
      )

      updateQueue({ [gallery.get('id')]: galleryQueue })
    }
  }

  UploadQueue.propTypes = propTypes

  return connect(
    state => ({ queue: state.get('uploadQueue') }),
    { updateQueue, createImage },
  )(UploadQueue)
}
