import BusyScreen from 'RAW/BusyScreen'
import DefaultPage from 'RAW/DefaultPage'
import GallerySlider from 'CONNECTED/GallerySlider'
import ImmuTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { exitFullscreen } from '../../utils/fullscreen'
import { setFullscreen } from 'STORE/actions/app'
import { sortImages } from 'UTILS/sortImages'
import styles from './Slideshow.less'

export class Slideshow extends React.Component {
  constructor() {
    super()

    this.state = {}
  }

  componentWillUnmount() {
    const { app, setFullscreen } = this.props
    if (app.get('fullscreen')) {
      setFullscreen(false)
      exitFullscreen()
    }
  }

  render() {
    const { app, gallery, startImage } = this.props
    const { active } = this.state
    const busy = app.get('busy').includes('DETAIL')
    if (!gallery) return null

    return (
      <DefaultPage
        parent={gallery.get('id')}
        showButtons
        fullscreen={app.get('fullscreen')}
        additionalClass={styles.black}
        activeImage={active}
      >
        {(busy && <BusyScreen />) || null}
        <GallerySlider
          gallery={gallery}
          images={gallery.get('images').sort(sortImages)}
          startImage={startImage}
          onChangeIndex={active => this.setState({ active })}
        />
      </DefaultPage>
    )
  }
}

Slideshow.propTypes = {
  app: ImmuTypes.map.isRequired,
  gallery: ImmuTypes.map,
  startImage: PropTypes.string,
  setFullscreen: PropTypes.func.isRequired,
}

const mapStoreToProps = (store, ownProps) => ({
  app: store.get('app'),
  gallery: store.getIn(['galleries', ownProps.params.id]),
  startImage: ownProps.image,
})

export default connect(
  mapStoreToProps,
  { setFullscreen },
)(Slideshow)
