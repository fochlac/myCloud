import PropTypes from 'prop-types'
import React from 'react'
import exifr from 'exifr'

import cx from '../../utils/classnames'
import styles from './DnDLayer.less'
import { createSmallObjectURL } from '../../utils/resizer'

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
    const { dragging, parsing, current, length } = this.state
    const { className, children, active } = this.props

    return (
      <div onDrop={this.onDragStop} className={cx(styles.wrapper, className)}>
        {children}
        {active && (
          <div className={dragging || parsing ? styles.dragging : styles.hidden}>
            {dragging && (
              <h2 className={styles.infoText}>
                Um Bilder hochzuladen, zieh sie einfach auf diese Fläche!
              </h2>
            )}
            {parsing && (
              <h2 className={styles.infoText}>
                <p>Bilder werden verarbeitet.</p>
                <p>
                  {current} von {length}
                </p>
                <span className="fa fa-spin fa-lg fa-circe-o-notch" />
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
        )}
      </div>
    )
  }

  handleNewFile(evt) {
    const files = evt.target.files
    this.setState({ parsing: true, length: Array.from(files).length, current: 0 })

    Promise.all(
      Array.from(files).reduce((promises, file, index) => {
        const oldPromise = promises[0] || Promise.resolve()

        promises.unshift(
          oldPromise.then(async () => {
            this.setState({ current: index + 1 })

            const metadata = await exifr.parse(file, { translateValues: false });

            const rotation = {1: 0, 3: 180, 5: 90, 6: 90, 7: 270, 8: 270}[metadata?.Orientation]

            return {
              file,
              name: file.name,
              rotate: String(rotation ?? 0),
              created: Date.now(),
              imageTaken: metadata?.DateTimeOriginal ? metadata.DateTimeOriginal.getTime() : undefined,
              objectUrl: await createSmallObjectURL(file, 200, rotation),
              id: `${file.lastModified}_${file.size}`,
            }
          }),
        )
        return promises
      }, []),
    ).then(files => {
      this.setState({ parsing: false, length: 0 })
      this.props.onDrop(files.reverse())
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
