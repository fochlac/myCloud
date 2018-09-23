import PropTypes from 'prop-types'
import React from 'react'
import cx from 'UTILS/classnames'
import styles from './Dialog.less'

export default class Dialog extends React.Component {
  constructor() {
    super()

    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
  }

  handleKeyUp(evt) {
    if (
      evt.keyCode === 27 &&
      (!document.activeElement ||
        !['input', 'textarea', 'select'].includes(document.activeElement.tagName.toLowerCase()))
    ) {
      this.props.onClose()
    }
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  closeDialog(evt) {
    if (evt.target.classList.contains('dialogBackground') && this.props.closeOnBackdrop) {
      this.props.onClose()
    }
  }

  render() {
    const { className, children, header, onClose } = this.props
    return (
      <div className={cx(styles.dialogBackground, 'dialogBackground')} onClick={this.closeDialog}>
        <div className={cx(styles.dialog, className)}>
          <div className={styles.header}>
            {header}
            <span className={cx('fa fa-times', styles.closeButton)} onClick={onClose} />
          </div>
          {children}
        </div>
      </div>
    )
  }
}

Dialog.propTypes = {
  closeOnBackdrop: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.any,
  header: PropTypes.any,
  onClose: PropTypes.func.isRequired,
}
