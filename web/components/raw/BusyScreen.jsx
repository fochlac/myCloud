import './BusyScreen.less'

import React from 'react'

export default function BusyScreen({ show }) {
  return show ? (
    <div className="busyBackground">
      <div className="loadingCircle" />
      <div className="loadingCircleContent">
        <span className="fa fa-2x fa-calendar" />
      </div>
    </div>
  ) : null
}
