import Dialog from 'RAW/Dialog'
import ButtonBar from 'RAW/ButtonBar'
import PropTypes from 'prop-types'
import React from 'react'
import { GalleryType } from '../../types/api-types'
import styles from './ManageUrlDialog.less'
import cx from 'UTILS/classnames'
import copy from 'UTILS/clipboard'

export default class ManageUrlDialog extends React.Component {
  constructor() {
    super()

    this.state = {
      access: 'read',
    }
  }

  render() {
    const { createUrl, deleteUrl, onClose, gallery } = this.props
    const buttons = [
      {
        text: 'Schließen',
        onClick: onClose,
      },
    ]

    return (
      <Dialog onClose={onClose} header={<h4>Galerie teilen</h4>}>
        <div className={styles.body}>
          <h4 className={styles.head}>Links:</h4>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Link</th>
                <th>Berechtigung</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {gallery.get('urls').map(url => {
                const href = `${window.location.origin}${url.get('access') === 'timeline' ? '/t' : ''}${url.get('url')}`
                return (
                <tr key={'url_' + url.get('id')}>
                  <td className={styles.urlCell}>
                    <a href={href} className={styles.url}>
                      {href}
                    </a>
                    <span
                      className={styles.copy}
                      onClick={() => copy(href)}
                    >
                      Kopieren
                    </span>
                  </td>
                  <td>
                    {url.get('access') === 'read' ? 'Lesen' : ''}
                    {url.get('access') === 'write' ? 'Lesen & Schreiben' : ''}
                    {url.get('access') === 'timeline' ? 'Zeitstrahl' : ''}
                  </td>
                  <td>
                    <span
                      className={cx('fa fa-trash', styles.buttons)}
                      onClick={() => deleteUrl(gallery.get('id'), url.get('id'))}
                    />
                  </td>
                </tr>
              )
              })}
              <tr>
                <td className={styles.newLink}>Neuen Link erstellen</td>
                <td>
                  <select
                    onChange={({ target: { value } }) => this.setState({ access: value })}
                    className={styles.access}
                  >
                    <option value="read">Lesen</option>
                    <option value="timeline">Timeline</option>
                    <option value="write">Lesen & Schreiben</option>
                  </select>
                </td>
                <td>
                  <span
                    className={cx('fa fa-plus-circle', styles.buttons)}
                    onClick={() =>
                      createUrl({ gallery: gallery.get('id'), access: this.state.access })
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <ButtonBar buttons={buttons} />
        </div>
      </Dialog>
    )
  }
}

ManageUrlDialog.propTypes = {
  createUrl: PropTypes.func.isRequired,
  deleteUrl: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  gallery: GalleryType.isRequired,
}
