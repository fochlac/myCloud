import { ImageType } from '../../types/api-types'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styles from './Image.less'

class Image extends React.PureComponent {
  constructor() {
    super()

    this.state = {
      ready: false,
    }
  }

  render() {
    const { image, size, src, title, width, height, background, hd, style } = this.props
    const { ready } = this.state
    const factor = hd ? 2 : 1.2
    const imgWidth = Math.ceil(((width || size) * factor) / 100) * 100
    const imgHeight = Math.ceil(((height || size) * factor) / 100) * 100
    const url =
      (image &&
        `/api/images/${image.get('id')}?width=${imgWidth}&height=${imgHeight}` +
          `&lastModified=${image.get('lastModified')}`) ||
      src

    const loadingCircleSize = Math.ceil((width + height || size) / 300) || 1

    return (
      <div
        className={styles.wrapper}
        style={{ height: `${height || size}px`, width: `${width || size}px`, background }}
      >
        {image || src ? (
          <img
            style={{ ...style, maxHeight: `${height || size}px`, maxWidth: `${width || size}px` }}
            className={this.state.ready ? styles.image : styles.hidden}
            title={title}
            src={url}
            onLoad={() => this.setState({ ready: true })}
          />
        ) : (
          <span className={`fa fa-image ${styles.placeholder}`} />
        )}
        {(image || src) &&
          !ready && <span className={`fa fa-${loadingCircleSize}x fa-circle-o-notch fa-spin `} />}
      </div>
    )
  }
}

Image.defaultProps = {
  size: 200,
  hd: false,
  src: null,
  title: '',
  background: 'white',
}

Image.propTypes = {
  image: ImageType,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  src: PropTypes.string,
  title: PropTypes.string,
  background: PropTypes.string,
  hd: PropTypes.bool,
}

export default connect(state => ({
  hd: state.getIn(['app', 'hd']),
}))(Image)
