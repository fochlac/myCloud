import GalleryCard from 'RAW/GalleryCard'
import React from 'react'
import { connect } from 'react-redux'
import style from './GalleryList.less'
import { createGallery } from 'STORE/actions';
import CreateGalleryCard from 'RAW/CreateGalleryCard'

export class GalleryList extends React.Component {
  render() {
    const { galleries, createGallery } = this.props

    return <section className={style.list}>
        {galleries
          .toList()
          .map(gallery => <GalleryCard key={gallery.get('id')} gallery={gallery} />)}
        <CreateGalleryCard createGallery={createGallery} />
      </section>
  }
}

export default connect(
  store => ({
    galleries: store.get('galleries'),
  }),
  { createGallery },
)(GalleryList)
