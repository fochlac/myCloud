import Dialog from 'RAW/Dialog'
import ButtonBar from 'RAW/ButtonBar'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './DeleteGalleryDialog.less'

export default function DeleteGalleryDialog({ onConfirm, onClose }) {
  const buttons = [
    {
      text: 'Abbrechen',
      type: 'secondary',
      onClick: onClose,
    },
    {
      text: 'Bestätigen',
      type: 'destructive',
      onClick: onConfirm,
    },
  ]

  return (
    <Dialog onClose={onClose} header={<h4>Galerie löschen</h4>}>
      <div className={styles.body}>
        <p>
          Sind Sie sich sicher, dass Sie diese Galerie und alle enthaltenen Galerien löschen wollen?
        </p>
        <ButtonBar buttons={buttons} />
      </div>
    </Dialog>
  )
}

DeleteGalleryDialog.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
