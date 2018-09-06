import Image from './Image'
import { Link } from 'react-router-dom'
import { Map } from 'immutable'
import React from 'react'
import styles from './GalleryCard.less'

function GalleryCard({ gallery }) {
  return (
    <Link to={`/gallery/${gallery.get('id')}`}>
      <div className={styles.card}>
        <Image image={gallery.getIn(['images', 0])} size="200" />
        <div className={styles.name}>
          <p>{gallery.get('name')}</p>
        </div>
      </div>
    </Link>
  )
}

GalleryCard.defaultProps = {
  gallery: Map(),
}

export default GalleryCard
