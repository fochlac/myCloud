import './BaseStyle.less'

import HdButton from 'CONNECTED/HdButton'
import { Link } from 'react-router-dom'
import LoginButton from 'CONNECTED/LoginButton'
import PropTypes from 'prop-types'
import React from 'react'
import cx from 'UTILS/classnames'
import style from './DefaultPage.less'

export default function DefaultPage({
  parent,
  children,
  showButtons,
  additionalClass,
  activeImage,
  fullscreen,
}) {
  return (
    <div className={cx(style.body, { [style.fullscreenBody]: fullscreen })}>
      <div className={cx(style.topbar, { [style.fullscreen]: fullscreen })}>
        {showButtons && (
          <div className={style.buttons}>
            <Link
              to={parent ? `/gallery/${parent}${activeImage ? '?active=' + activeImage : ''}` : '/'}
              className={style.symbol + ' fa fa-arrow-left'}
            />
            <Link to="/" className="fa fa-home" />
          </div>
        )}
        {!fullscreen && <h3 className={style.name}>Gallery</h3>}
        <HdButton {...{ fullscreen }} />
        <LoginButton />
      </div>
      <div className={`${style.content} ${additionalClass}`}>{children}</div>
    </div>
  )
}

DefaultPage.propTypes = {
  parent: PropTypes.string,
  activeImage: PropTypes.number,
  children: PropTypes.any,
  showButtons: PropTypes.bool,
  fullscreen: PropTypes.bool,
  additionalClass: PropTypes.string,
}

DefaultPage.defaultProps = {
  additionalClass: '',
}
