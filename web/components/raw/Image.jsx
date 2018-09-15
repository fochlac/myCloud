import ImmuTypes from 'immutable-prop-types'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './Image.less'

class Image extends React.Component {
  constructor() {
    super()

    this.state = {
      ready: false,
    }
  }

  render() {
    const { image, size, src, title, width, height, background } = this.props
    const { ready } = this.state
    const url =
      (image &&
        `/api/images/${image.get('id')}?width=${width || size - 10}&height=${height ||
          size - 10}`) ||
      src

    const loadingCircleSize = Math.ceil((width + height || size) / 300) || 1

    return (
      <div
        className={styles.wrapper}
        style={{ height: `${height || size}px`, width: `${width || size}px`, background }}
      >
        {image || src ? (
          <img
            style={{ maxHeight: `${height || size}px`, maxWidth: `${width || size}px` }}
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
  src: null,
  title: '',
  background: 'white',
}

Image.propTypes = {
  image: ImmuTypes.map,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  src: PropTypes.string,
  title: PropTypes.string,
  background: PropTypes.string,
}

export default Image
