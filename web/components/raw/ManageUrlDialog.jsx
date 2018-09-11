import Dialog from 'RAW/Dialog'
import ButtonBar from 'RAW/ButtonBar'
import PropTypes from 'prop-types'
import React from 'react'
import { GalleryType } from '../../types/api-types'

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
      <Dialog onClose={onClose} header={<h4>Gallerie teilen</h4>}>
        <div>
          <h4>Links:</h4>
          <table>
            <tr>
              <th>Link</th>
              <th>Berechtigung</th>
              <th />
            </tr>
            {gallery.get('urls').map(url => (
              <tr key={'url_' + url.get('id')}>
                <td>{url.get('url')}</td>
                <td>{url.get('access') === 'read' ? 'Lesen' : 'Lesen & Schreiben'}</td>
                <td>
                  <span
                    className="fa fa-lg fa-trash"
                    onClick={() => deleteUrl(gallery.get('id'), url.get('id'))}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td>Neuer Link</td>
              <td>
                <select onChange={({ target: { value } }) => this.setState({ access: value })}>
                  <option value="read">Lesen</option>
                  <option value="write">Lesen & Schreiben</option>
                </select>
              </td>
              <td>
                <span
                  className="fa fa-lg fa-plus-circle"
                  onClick={() =>
                    createUrl({ gallery: gallery.get('id'), access: this.state.access })
                  }
                />
              </td>
            </tr>
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
