import PropTypes from 'prop-types'
import React from 'react'
import cx from '../../utils/classnames'
import styles from './DnDLayer.less'

export default class DnDLayer extends React.Component {
  constructor() {
    super()

    this.state = {
      dragging: false,
    }

    this.onDragStart = this.onDragStart.bind(this)
    this.onDragStop = this.onDragStop.bind(this)
  }

  componentDidMount() {
    document.addEventListener('dragenter', this.onDragStart)
    document.addEventListener('dragexit', this.onDragStop)
    document.addEventListener('mouseover', this.onDragStop)
  }
  componentWillUnmount() {
    document.removeEventListener('dragenter', this.onDragStart)
    document.removeEventListener('dragexit', this.onDragStop)
    document.removeEventListener('mouseover', this.onDragStop)
  }

  render() {
    const { dragging } = this.state
    const { className, children } = this.props

    return (
      <div onDrop={this.onDragStop} className={cx(styles.wrapper, className)}>
        {children}
        <div className={dragging ? styles.dragging : styles.hidden}>
          {dragging && (
            <h2 className={styles.infoText}>
              Um Bilder hochzuladen, zieh sie einfach auf diese Fläche!
            </h2>
          )}
          <input
            type="file"
            name="Image"
            accept="image/*"
            multiple
            value=""
            className={styles.input}
            onChange={evt => this.handleNewFile(evt)}
          />
        </div>
      </div>
    )
  }

  handleNewFile(evt) {
    const files = evt.target.files

    this.props.onDrop(
      Array.from(files).map(file => ({
        file,
        name: file.name,
        created: file.lastModified,
        objectUrl: URL.createObjectURL(file),
        id: `${file.lastModified}_${file.size}`,
      })),
    )
  }

  onDragStart() {
    this.setState({ dragging: true })
    this.isDragging = true
  }

  onDragStop() {
    if (!this.isDragging) return
    this.setState({ dragging: false })
    this.isDragging = false
  }
}

DnDLayer.propTypes = {
  onDrop: PropTypes.func.isRequired,
  className: PropTypes.string,
}
