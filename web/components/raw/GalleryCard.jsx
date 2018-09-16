import Card from './Card'
import ImmuTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'
import { Map } from 'immutable'
import React from 'react'

function GalleryCard({ gallery }) {
  return (
    <Link to={`/gallery/${gallery.get('id')}`}>
      <Card image={gallery.getIn(['images', 0])}>
        <p title={gallery.get('name')}>{gallery.get('name')}</p>
      </Card>
    </Link>
  )
}

GalleryCard.defaultProps = {
  gallery: Map(),
}

GalleryCard.propTypes = {
  gallery: ImmuTypes.map,
}

export default GalleryCard
