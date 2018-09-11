import { deleteImage, updateImage } from 'STORE/actions'

import Image from 'RAW/Image'
import ImmuTypes from 'immutable-prop-types'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styles from './GallerySlider.less'

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
      props.gallery.get('images').findIndex(image => image.get('id') === props.startImage)

    this.state = {
      index: (index !== -1 && index) || 0,
    }

    this.handleEdit = this.handleEdit.bind(this)
  }

  render() {
    const { deleteImage, gallery } = this.props
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
          {gallery.get('images').map((image, slide) => (
            <Slide key={image.get('id')} image={image} type={getSlideType(slide, index)} />
          ))}
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
  gallery: ImmuTypes.map.isRequired,
  startImage: PropTypes.string,
  deleteImage: PropTypes.func.isRequired,
  updateImage: PropTypes.func.isRequired,
}

export default connect(
  () => ({}),
  { deleteImage, updateImage },
)(GallerySlider)

function Slide({ image, type }) {
  const additionalClass = [SLIDE.OLD, SLIDE.LAST].includes(type) ? styles.old : ''

  const maxHeight = Math.floor((window.innerHeight - 48) / 25) * 25
  const maxWidth = Math.floor((window.innerWidth - 50) / 25) * 25

  return (
    <div className={`${styles.slide} ${additionalClass}`}>
      {type !== SLIDE.EMPTY && (
        <Image image={image} width={maxWidth} height={maxHeight} background="black" />
      )}
    </div>
  )
}