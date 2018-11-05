import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { setHd } from 'STORE/actions'
import styles from './HdButton.less'

function HdButton({ hd, setHd }) {
  return (
    <div className={hd ? styles.active : styles.inactive} onClick={() => setHd(!hd)}>
      HD
    </div>
  )
}

HdButton.propTypes = {
  hd: PropTypes.bool,
  setHd: PropTypes.func.isRequired,
}

export default connect(
  state => ({
    hd: state.getIn(['app', 'hd']),
  }),
  { setHd },
)(HdButton)
