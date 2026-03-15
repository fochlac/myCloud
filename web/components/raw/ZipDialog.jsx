import ButtonBar from 'RAW/ButtonBar'
import Dialog from 'RAW/Dialog'
import { GalleryType } from '../../types/api-types'
import PropTypes from 'prop-types'
import React from 'react'
import ZipBuilder from 'UTILS/zipBuilder'
import styles from './ZipDialog.less'

export default class ZipDialog extends React.Component {
  constructor() {
    super()

    this.state = {
      view: 'init',
      imageCount: 0,
      position: 0,
      size: '1280',
      objectUrl: null,
      totalImageCount: 0,
      chunkIndex: 1,
      chunkCount: 1,
      startIndex: 0,
      endIndex: 0,
      hasMore: false,
      nextStartIndex: 0,
      fileName: null,
    }

    this.zip = new ZipBuilder({
      onInit: () => this.setState({ view: 'settings' }),
      onChange: progress => {
        this.setState(progress)
      },
      onSuccess: (save, objectUrl, progress) => {
        this.cleanupObjectUrl(objectUrl)
        this.setState({ view: 'success', objectUrl, ...progress })
        save()
      },
      onError: console.log,
      onAbort: () => this.setState({ view: 'settings' }),
    })

    this.loadGallery = this.loadGallery.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentWillUnmount() {
    this.cleanupObjectUrl()
  }

  cleanupObjectUrl(nextObjectUrl = null) {
    const { objectUrl } = this.state

    if (objectUrl && objectUrl !== nextObjectUrl) {
      URL.revokeObjectURL(objectUrl)
    }
  }

  handleClose() {
    this.cleanupObjectUrl()
    this.props.onClose()
  }

  loadGallery(startIndex = 0) {
    const {
      props: { gallery },
      state: { size },
    } = this

    if (gallery && this.zip.ready) {
      this.cleanupObjectUrl()
      this.setState({
        view: 'started',
        objectUrl: null,
        position: 0,
        startIndex,
        endIndex: startIndex,
      })
      this.zip.zipGallery(gallery, { size }, { startIndex })
    }
  }

  renderContent() {
    const {
      props: { onClose, gallery },
      state: {
        imageCount,
        position,
        size,
        view,
        objectUrl,
        totalImageCount,
        chunkIndex,
        chunkCount,
        startIndex,
        endIndex,
        hasMore,
        nextStartIndex,
        fileName,
      },
    } = this

    const progress = imageCount ? Math.round((position / imageCount) * 100) : 0
    const downloadedFrom = Math.min(startIndex + 1, totalImageCount || imageCount)
    const downloadedTo = Math.min(endIndex, totalImageCount || imageCount)

    const buttonsDefault = [
      {
        text: 'Schließen',
        onClick: this.handleClose,
        type: 'secondary',
      },
    ]

    const buttonsSuccess = hasMore
      ? [
          {
            text: 'Schließen',
            onClick: this.handleClose,
            type: 'secondary',
          },
          {
            text: 'Weiter',
            onClick: () => this.loadGallery(nextStartIndex),
          },
        ]
      : [
          {
            text: 'Schließen',
            onClick: this.handleClose,
          },
        ]

    const buttonsProgress = [
      {
        text: 'Abbrechen',
        onClick: () => this.zip.abortZip(),
        type: 'secondary',
      },
    ]

    switch (view) {
      case 'init':
        return (
          <div className={styles.init}>
            <h3>Vorbereiten der Werkzeuge</h3>
            <span className="fa fa-lg fa-spin fa-circle-o-notch" />
          </div>
        )
      case 'settings':
        return [
          <div key="1" className={styles.selectSize}>
            <h4>Galerie herunterladen</h4>
            <p>
              Bitte wählen sie die maximale Bildgröße aus, in der Sie die Bilder herunterladen
              wollen.
            </p>
            <select value={size} onChange={({ target }) => this.setState({ size: target.value })}>
              <option value="1280">HD 720p</option>
              <option value="1920">Full HD</option>
              <option value="3840">UHD 4k</option>
              <option value="raw">Unverändert</option>
            </select>
            <button onClick={this.loadGallery}>Download starten</button>
          </div>,
          <ButtonBar key="2" buttons={buttonsDefault} />,
        ]
      case 'started':
        return [
          <div key="1" className={styles.progress}>
            <h5>Fortschritt</h5>
            <p>
              Paket {chunkIndex} von {chunkCount}
              {totalImageCount > imageCount ? ` (${downloadedFrom} - ${downloadedTo} von ${totalImageCount} Bildern)` : null}
            </p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <p>
              {position} von {imageCount} Bildern geladen
            </p>
          </div>,
          <ButtonBar key="2" buttons={buttonsProgress} />,
        ]
      case 'success':
        return [
          <div key="1" className={styles.success}>
            <h4>{hasMore ? 'Paket bereit' : 'Vorgang abgeschlossen'}</h4>
            {chunkCount > 1 && (
              <p className={styles.text}>
                Paket {chunkIndex} von {chunkCount} mit Bildern {downloadedFrom} bis {downloadedTo} ist fertig.
              </p>
            )}
            <p className={styles.text}>
              Sollte der Download nicht automatisch starten, klicken sie hier:
              <a
                className={styles.link}
                href={objectUrl}
                download={fileName}
              >
                {fileName}
              </a>
            </p>
            {hasMore && (
              <p className={styles.text}>
                Mit „Weiter“ wird das nächste Paket erstellt.
              </p>
            )}
          </div>,
          <ButtonBar key="2" buttons={buttonsSuccess} />,
        ]
    }
  }

  render() {
    const {
      props: { onClose },
      state: { view },
    } = this

    const closable = ['settings', 'init', 'success'].includes(view)

    return (
      <Dialog onClose={closable ? this.handleClose : () => null} header={<h4>Zip erstellen</h4>}>
        <div className={styles.body}>{this.renderContent()}</div>
      </Dialog>
    )
  }
}

ZipDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  gallery: GalleryType.isRequired,
}
