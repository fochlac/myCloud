import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import cx from 'UTILS/classnames'
import { setHd } from 'STORE/actions'
import styles from './HdButton.less'

function HdButton({ hd, setHd, fullscreen }) {
  return (
    <div
      className={cx({
        [styles.active]: hd,
        [styles.inactive]: !hd,
        [styles.fullscreen]: fullscreen,
      })}
      onClick={() => setHd(!hd)}
    >
      HD
    </div>
  )
}

HdButton.propTypes = {
  hd: PropTypes.bool,
  fullscreen: PropTypes.bool,
  setHd: PropTypes.func.isRequired,
}

export default connect(
  state => ({
    hd: state.getIn(['app', 'hd']),
  }),
  { setHd },
)(HdButton)
