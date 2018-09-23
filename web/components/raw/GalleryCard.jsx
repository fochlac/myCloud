import { GalleryType, ImageType } from '../../types/api-types'

import Card from './Card'
import { Link } from 'react-router-dom'
import { Map } from 'immutable'
import React from 'react'

function GalleryCard({ gallery, image }) {
  return (
    <Link to={`/gallery/${gallery.get('id')}`}>
      <Card image={image}>
        <p title={gallery.get('name')}>{gallery.get('name')}</p>
      </Card>
    </Link>
  )
}

GalleryCard.defaultProps = {
  gallery: Map(),
}

GalleryCard.propTypes = {
  gallery: GalleryType,
  image: ImageType,
}

export default GalleryCard
