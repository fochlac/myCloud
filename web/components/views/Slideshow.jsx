import BusyScreen from 'RAW/BusyScreen'
import DefaultPage from 'RAW/DefaultPage'
import GallerySlider from 'CONNECTED/GallerySlider'
import ImmuTypes from 'immutable-prop-types'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styles from './Slideshow.less'

export class Gallery extends React.Component {
  render() {
    const { app, gallery, startImage } = this.props
    const busy = app.get('busy').includes('DETAIL')
    if (!gallery) return null

    return (
      <DefaultPage parent={gallery.get('id')} showButtons additionalClass={styles.black}>
        {(busy && <BusyScreen />) || null}
        <GallerySlider gallery={gallery} startImage={startImage} />
      </DefaultPage>
    )
  }
}

Gallery.propTypes = {
  app: ImmuTypes.map.isRequired,
  gallery: ImmuTypes.map,
  galleries: ImmuTypes.map.isRequired,
  startImage: PropTypes.string,
}

const mapStoreToProps = (store, ownProps) => ({
  app: store.get('app'),
  gallery: store.getIn(['galleries', ownProps.params.id]),
  startImage: ownProps.image,
})

export default connect(mapStoreToProps)(Gallery)
