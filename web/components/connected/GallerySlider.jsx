import { GalleryType, ImageType } from '../../types/api-types'
import { deleteImage, rotateImage, updateImage } from 'STORE/actions'

import Image from 'CONNECTED/Image'
import ImmuTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import React from 'react'
import { Swipeable } from '../../utils/Swipe'
import { connect } from 'react-redux'
import styles from './GallerySlider.less'
import { withRouter } from 'react-router-dom'

export const SLIDE = {
  ACTIVE: 'ACTIVE',
  LAST: 'LAST',
  NEXT: 'NEXT',
  OLD: 'OLD',
  NEW: 'NEW',
}

const SwipableDiv = Swipeable(props => <div {...props} />)

class GallerySlider extends React.Component {
  constructor(props) {
    super()

    const index =
      props.startImage && props.images.findIndex(image => image.get('id') === props.startImage)

    this.state = {
      index: (index !== -1 && index) || 0,
    }

    this.handleEdit = this.handleEdit.bind(this)
    this.handleKeys = this.handleKeys.bind(this)
    this.prevImage = this.prevImage.bind(this)
    this.nextImage = this.nextImage.bind(this)
  }

  componentDidMount() {
    const {
      state: { index },
      props: { onChangeIndex },
    } = this
    document.addEventListener('keydown', this.handleKeys)
    onChangeIndex && onChangeIndex(index)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeys)
  }

  componentDidUpdate(lastProps, lastState) {
    const {
      state: { index },
      props: { gallery, images, history, onChangeIndex },
    } = this

    if (!images.getIn([index, 'id']) && images.size) {
      this.setState({ index: images.size - 1 })
    } else if (!images.getIn([index, 'id'])) {
      history.push(`/gallery/${gallery.get('id')}`)
    } else if (lastState.index !== index) {
      window.history.replaceState(
        '',
        '',
        `/gallery/${gallery.get('id')}/slideshow?image=${images.getIn([index, 'id'])}`,
      )
      onChangeIndex && onChangeIndex(index)
    }
  }

  handleKeys({ keyCode }) {
    const { gallery, history } = this.props
    const { index } = this.state

    switch (keyCode) {
      case 37:
        this.prevImage()
        break
      case 39:
        this.nextImage()
        break
      case 27:
        history.push(`/gallery/${gallery.get('id')}?active=${index}`)
        break
    }
  }

  nextImage() {
    const { gallery } = this.props
    const { index } = this.state
    if (index === gallery.get('images').size - 1) return
    this.setState({ index: index + 1 })
  }

  prevImage() {
    const { index } = this.state
    if (!index) return
    this.setState({ index: index - 1 })
  }

  render() {
    const { images } = this.props
    const { index } = this.state

    return (
      <section className={styles.detail}>
        {index !== 0 && (
          <span
            onClick={() => this.setState({ index: index - 1 })}
            className={`${styles.button} ${styles.left}`}
          >
            <span className="fa fa-chevron-left fa-3x" />
          </span>
        )}
        <div className={styles.imageWrapper}>
          {images.map((image, slide) =>
            this.renderSlide({ image: image, type: getSlideType(slide, index) }),
          )}
        </div>
        {index < images.size - 1 && (
          <span
            onClick={() => this.setState({ index: index + 1 })}
            className={`${styles.button} ${styles.right}`}
          >
            <span className="fa fa-chevron-right fa-3x" />
          </span>
        )}
      </section>
    )
  }

  renderSlide({ image, type }) {
    const additionalClass = [SLIDE.OLD, SLIDE.LAST].includes(type) ? styles.old : ''
    const { deleteImage, rotateImage } = this.props
    const maxHeight = Math.floor((window.innerHeight - 48) / 25) * 25
    const maxWidth = Math.floor((window.innerWidth - 50) / 25) * 25

    return (
      <SwipableDiv
        onSwipeLeft={this.nextImage}
        onSwipeRight={this.prevImage}
        key={image.get('id')}
        className={`${styles.slide} ${additionalClass}`}
      >
        {![SLIDE.NEW, SLIDE.OLD].includes(type) && (
          <Image image={image} width={maxWidth} height={maxHeight} background="black" />
        )}
        {type === SLIDE.ACTIVE && (
          <div className={styles.editBar}>
            <span className="fa fa-trash fa-5x" onClick={() => deleteImage(image)} />
            <span className="fa fa-undo fa-5x" onClick={() => rotateImage(image, 'left')} />
            <span className="fa fa-repeat fa-5x" onClick={() => rotateImage(image)} />
          </div>
        )}
      </SwipableDiv>
    )
  }

  handleEdit(image) {
    const { updateImage } = this.props
    updateImage(image)
  }
}

function getSlideType(index, active) {
  if (index === active) {
    return SLIDE.ACTIVE
  } else if (index === active - 1) {
    return SLIDE.LAST
  } else if (index === active + 1) {
    return SLIDE.NEXT
  }
  return index > active ? SLIDE.NEW : SLIDE.OLD
}

GallerySlider.propTypes = {
  gallery: GalleryType.isRequired,
  images: ImmuTypes.listOf(ImageType).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  startImage: PropTypes.string,
  onChangeIndex: PropTypes.func,
  deleteImage: PropTypes.func.isRequired,
  rotateImage: PropTypes.func.isRequired,
  updateImage: PropTypes.func.isRequired,
}

export default withRouter(
  connect(
    () => ({}),
    { deleteImage, updateImage, rotateImage },
  )(GallerySlider),
)
