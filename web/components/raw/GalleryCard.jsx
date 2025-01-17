import { GalleryType, ImageType } from '../../types/api-types'

import Card from './Card'
import { Link } from 'react-router-dom'
import { Map } from 'immutable'
import React from 'react'

function GalleryCard({ gallery, image }) {
  const access = gallery.getIn(['accessToken', 'access'])

  if (!['timeline', 'read', 'write'].includes(access)) return null

  return (
    <Link to={`/${access === 'timeline' ? 'timelines' : 'gallery'}/${gallery.get('id')}`}>
      <Card image={image} showChildren>
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
