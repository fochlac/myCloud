import BusyScreen from 'RAW/BusyScreen'
import DefaultPage from 'RAW/DefaultPage'
import GalleryList from 'CONNECTED/GalleryList'
import ImmuTypes from 'immutable-prop-types'
import React from 'react'
import { connect } from 'react-redux'
// import style from './Gallery.less'

export class Gallery extends React.Component {
  render() {
    const { app, gallery, galleries } = this.props
    const busy = app.get('busy').includes('GALLERY')
    if (!gallery) return null
    const elements = gallery.get('children').map(id => galleries.get(id)).concat(gallery.get('images'))

    return <DefaultPage>
        {busy && <BusyScreen />}
        <GalleryList elements={elements} gallery={gallery}/>
      </DefaultPage>
  }
}

Gallery.propTypes = {
  app: ImmuTypes.map.isRequired,
  gallery: ImmuTypes.map,
  galleries: ImmuTypes.map.isRequired,
}

const mapStoreToProps = (store, ownProps) => ({
  app: store.get('app'),
  gallery: store.getIn(['galleries', ownProps.params.id]),
  galleries: store.get('galleries')
})

export default connect(
  mapStoreToProps,
)(Gallery)
