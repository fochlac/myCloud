import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styles from './Footer.less'

class Footer extends Component {
  render () {
    const { isRegisteredUser } = this.props
    if ( isRegisteredUser || localStorage && localStorage.hideFooter ) {
      return null
    }

    return (
      <div className={styles.footer}>
        <span>Please register or log in to ensure permanent access to your galleries.</span>
        <span className={`fa fa-lg fa-times ${styles.closeIcon}`} onClick={this.onClose.bind(this)}/>
      </div>
    )
  }

  onClose () {
    localStorage.hideFooter = true;
    this.forceUpdate()
  }
}

Footer.propTypes = {
  isRegisteredUser: PropTypes.bool
}

export default connect(
    state => ({
      isRegisteredUser: state.getIn(['user', 'id']),
    })
)(Footer)
