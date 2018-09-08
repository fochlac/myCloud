import './BaseStyle.less'

import { removeResizeFocus, resizeFocus } from 'UTILS/resizeFocus.js'

import { Link } from 'react-router-dom'
import React from 'react'
import style from './DefaultPage.less'

export default class DefaultPage extends React.Component {
  componentDidMount() {
    resizeFocus()
  }

  componentWillUnmount() {
    removeResizeFocus()
  }

  render() {
    return (
      <div className={style.body}>
        <div className={style.topbar}>
          <div className={style.buttons}>
            <Link to="/notes" className="fa fa-2x fa-sticky-note-o" />
            <Link to="/" className="fa fa-2x fa-home" />
          </div>
          <h3 className={style.name}>Gallery</h3>
        </div>
        <div className={style.content}>{this.props.children}</div>
      </div>
    )
  }
}

