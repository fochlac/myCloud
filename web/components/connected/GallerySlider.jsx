import { deleteImage, updateImage } from 'STORE/actions'

import { GalleryType } from '../../types/api-types'
import Image from 'RAW/Image'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { sortImages } from 'UTILS/sortImages'
import styles from './GallerySlider.less'
import { withRouter } from 'react-router-dom'

export const SLIDE = {
  ACTIVE: 'ACTIVE',
  LAST: 'LAST',
  NEXT: 'NEXT',
  OLD: 'OLD',
  NEW: 'NEW',
}

class GallerySlider extends React.Component {
  constructor(props) {
    super()

    const index =
      props.startImage &&
      props.gallery
        .get('images')
        .sort(sortImages)
        .findIndex(image => image.get('id') === props.startImage)

    this.state = {
      index: (index !== -1 && index) || 0,
    }

    this.handleEdit = this.handleEdit.bind(this)
    this.handleKeys = this.handleKeys.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeys)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeys)
  }

  componentDidUpdate() {
    const {
      state: { index },
      props: { gallery },
    } = this
    window.history.replaceState(
      '',
      '',
      `/gallery/${gallery.get('id')}/slideshow?image=${gallery.getIn(['images', index, 'id'])}`,
    )
  }

  handleKeys({ keyCode }) {
    const { gallery, history } = this.props
    const { index } = this.state

    switch (keyCode) {
      case 37:
        if (!index) return
        this.setState({ index: index - 1 })
        break
      case 39:
        if (index === gallery.get('images').size - 1) return
        this.setState({ index: index + 1 })
        break
      case 27:
        history.push(`/gallery/${gallery.get('id')}`)
        break
    }
  }

  render() {
    const { gallery } = this.props
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
          {gallery
            .get('images')
            .sort(sortImages)
            .map((image, slide) =>
              this.renderSlide({ image: image, type: getSlideType(slide, index) }),
            )}
        </div>
        {index < gallery.get('images').size - 1 && (
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

    const maxHeight = Math.floor((window.innerHeight - 48) / 25) * 25
    const maxWidth = Math.floor((window.innerWidth - 50) / 25) * 25

    return (
      <div key={image.get('id')} className={`${styles.slide} ${additionalClass}`}>
        {![SLIDE.NEW, SLIDE.OLD].includes(type) && (
          <Image image={image} width={maxWidth} height={maxHeight} background="black" />
        )}
      </div>
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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  startImage: PropTypes.string,
  deleteImage: PropTypes.func.isRequired,
  updateImage: PropTypes.func.isRequired,
}

export default withRouter(
  connect(
    () => ({}),
    { deleteImage, updateImage },
  )(GallerySlider),
)
