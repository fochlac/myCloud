import PropTypes from 'prop-types'
import React from 'react'
import cx from '../../utils/classnames'
import styles from './DnDLayer.less'
import { createSmallObjectURL } from '../../utils/resizer';

export default class DnDLayer extends React.Component {
  constructor() {
    super()

    this.state = {
      dragging: false,
      parsing: false,
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
    const { dragging, parsing } = this.state
    const { className, children, active } = this.props

    return (
      <div onDrop={this.onDragStop} className={cx(styles.wrapper, className)}>
        {children}
        {active && <div className={dragging||parsing ? styles.dragging : styles.hidden}>
          {dragging && (
            <h2 className={styles.infoText}>
              Um Bilder hochzuladen, zieh sie einfach auf diese Fläche!
            </h2>
          )}
          {parsing && (
            <h2 className={styles.infoText}>
              Bilder werden verarbeitet.
              <span className="fa fa-spin fa-lg fa-circe-o-notch"></span>
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
        </div>}
      </div>
    )
  }

  handleNewFile(evt) {
    const files = evt.target.files
    this.setState({parsing: true})
    Promise.all(Array.from(files).map(async (file) => ({
        file,
        name: file.name,
        created: file.lastModified,
        objectUrl: await createSmallObjectURL(file),
        id: `${file.lastModified}_${file.size}`,
      }))).then((files) => {
        this.props.onDrop(files)
        this.setState({parsing: false})
      })
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
  active: PropTypes.bool,
  children: PropTypes.any,
}
