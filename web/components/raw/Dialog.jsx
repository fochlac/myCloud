import './Dialog.less'

import React from 'react'
import cx from 'UTILS/classnames'
import styles from './Dialog.less'

export default class Dialog extends React.Component {
  constructor() {
    super()

    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  handleKeyUp(evt) {
    if (
      evt.keyCode === 27 &&
      (!document.activeElement ||
        !['input', 'textarea', 'select'].includes(document.activeElement.tagName.toLowerCase()))
    ) {
      this.props.close_dialog()
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
      this.props.close_dialog()
    }
  }

  render() {
    const { className, children } = this.props
    return (
      <div
        className={cx(styles.dialogBackground, 'dialogBackground')}
        onClick={this.closeDialog.bind(this)}
      >
        <div className={cx(styles.dialog, className)}>{children}</div>
      </div>
    )
  }
}
