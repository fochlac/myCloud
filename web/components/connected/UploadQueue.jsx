import { createImage, updateQueue } from 'STORE/actions'

import ImmuTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'

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
        (queue && queue.get(gallery.get('id'))) ||
        fromJS({ promise: [Promise.resolve(), Promise.resolve(), Promise.resolve()], images: [] })

      galleryQueue = galleryQueue.set(
        'images',
        galleryQueue
          .get('images')
          .concat(fromJS(images.map(image => ({ ...image, isUploading: true })))),
      )

      let imageUploadQueue = images.map((image) => () => createImage(image, gallery.get('id')))

      function startNext() {
        if (imageUploadQueue.length) {
          return imageUploadQueue.shift()().then(() => startNext())
        }
      }

      galleryQueue = galleryQueue.set(
        'promise',
        galleryQueue.get('promise').map(promise => promise.then(() => startNext()))
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
