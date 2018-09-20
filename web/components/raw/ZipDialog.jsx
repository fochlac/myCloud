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
    }

    this.zip = new ZipBuilder({
      onInit: () => this.setState({ view: 'settings' }),
      onChange: progress => {
        this.setState(progress)
      },
      onSuccess: (save, objectUrl) => {
        this.setState({ view: 'success', objectUrl })
        save()
      },
      onError: console.log,
      onAbort: () => this.setState({ view: 'settings' }),
    })

    this.loadGallery = this.loadGallery.bind(this)
  }

  loadGallery() {
    const {
      props: { gallery },
      state: { size },
    } = this

    if (gallery && this.zip.ready) {
      this.setState({ view: 'started' })
      this.zip.zipGallery(gallery, { size })
    }
  }

  renderContent() {
    const {
      props: { onClose, gallery },
      state: { imageCount, position, size, view, objectUrl },
    } = this

    const buttonsDefault = [
      {
        text: 'Schließen',
        onClick: onClose,
        type: 'secondary',
      },
    ]

    const buttonsSuccess = [
      {
        text: 'Schließen',
        onClick: onClose,
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
            <div className={styles.progressBar}>
              {gallery.get('images').map((img, index) => (
                <div key={index} className={styles[index < position ? 'done' : 'todo']} />
              ))}
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
            <h4>Vorgang abgeschlossen</h4>
            <p className={styles.text}>
              Sollte der Download nicht automatisch starten, klicken sie hier:
              <a
                className={styles.link}
                href={objectUrl}
                download={`${gallery.get('name').replace(/[^a-zA-Z0-9-_]+/g, '_')}.zip`}
              >
                {gallery.get('name').replace(/[^a-zA-Z0-9-_]+/g, '_') + '.zip'}
              </a>
            </p>
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
      <Dialog onClose={closable ? onClose : () => null} header={<h4>Zip erstellen</h4>}>
        <div className={styles.body}>{this.renderContent()}</div>
      </Dialog>
    )
  }
}

ZipDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  gallery: GalleryType.isRequired,
}
