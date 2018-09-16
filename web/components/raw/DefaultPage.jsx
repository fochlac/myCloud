import './BaseStyle.less'

import { removeResizeFocus, resizeFocus } from 'UTILS/resizeFocus.js'

import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
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
    const { parent, children, showButtons, additionalClass } = this.props

    return (
      <div className={style.body}>
        <div className={style.topbar}>
          {showButtons && (
            <div className={style.buttons}>
              <Link
                to={parent ? `/gallery/${parent}` : '/'}
                className={style.symbol + ' fa fa-arrow-left'}
              />
              <Link to="/" className="fa fa-home" />
            </div>
          )}
          <h3 className={style.name}>Gallery</h3>
          <LoginButton />
        </div>
        <div className={`${style.content} ${additionalClass}`}>{children}</div>
      </div>
    )
  }
}

DefaultPage.propTypes = {
  parent: PropTypes.string,
  children: PropTypes.any,
  showButtons: PropTypes.bool,
  additionalClass: PropTypes.string,
}

DefaultPage.defaultProps = {
  additionalClass: '',
}
