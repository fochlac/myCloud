import './BaseStyle.less'

import { removeResizeFocus, resizeFocus } from 'UTILS/resizeFocus.js'

import { Link } from 'react-router-dom'
import React from 'react'
import { connect } from 'react-redux'
import style from './DefaultPage.less'

export class DefaultPage extends React.Component {
  componentDidMount() {
    resizeFocus()
  }

  componentWillUnmount() {
    removeResizeFocus()
  }

  render() {
    return (
      <div className={style.body}>
        <div className={style.topbar}>Topbar</div>
        <div className={style.content}>{this.props.children}</div>
        <div className={style.bottombar}>
          <Link to="/" className="fa fa-2x fa-home" />
          <Link to="/calendar" className="fa fa-2x fa-calendar" />
          <Link to="/notes" className="fa fa-2x fa-sticky-note-o" />
        </div>
      </div>
    )
  }
}

export default connect(
  store => ({}),
  {},
)(DefaultPage)
