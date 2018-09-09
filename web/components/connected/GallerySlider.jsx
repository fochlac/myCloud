import React from 'react'
import PropTypes from 'prop-types'
import ImmuTypes from 'immutable-prop-types'
import { connect } from 'react-redux'
import styles from './GallerySlider.less'
import { deleteImage, updateImage } from 'STORE/actions'
import Image from 'RAW/Image'

class GallerySlider extends React.Component {
  constructor(props) {
    super()

    const index = props.startImage && props.gallery.get('images').findIndex(image => image.get('id') === props.startImage)

    this.state = {
      index: index !== -1  && index || 0
    }

    this.handleEdit = this.handleEdit.bind(this)
  }


  render() {
    const { deleteImage, gallery } = this.props
    const { index } = this.state

    return <section className={styles.detail}>
        {(index !== 0) && <div className={styles.old}>
          <Image image={gallery.getIn(['images', index - 1])} size={600} />
        </div>}
        <div className={styles.current}>
          <Image image={gallery.getIn(['images', index])} size={600} />

        </div>
        <div className={styles.next}>
          <Image image={gallery.getIn(['images', index + 1])} size={600} />
        </div>
        <button onClick={() => this.setState({index: index + 1})}>next</button>
      </section>
  }


  handleEdit(image) {
    const { updateImage } = this.props
    updateImage(image)
  }
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
