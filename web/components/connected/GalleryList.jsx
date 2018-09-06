import GalleryCard from 'RAW/GalleryCard'
import React from 'react'
import { connect } from 'react-redux'
import style from './GalleryList.less'

export class GalleryList extends React.Component {
  render() {
    const { galleries } = this.props

    return (
      <div className={style.list}>
        {galleries.toList().map(gallery => (
          <GalleryCard key={gallery.get('id')} gallery={gallery} />
        ))}
      </div>
    )
  }
}

export default connect(store => ({
  galleries: store.get('galleries'),
}))(GalleryList)
