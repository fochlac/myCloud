import './BusyScreen.less'

import React from 'react'

export default class BusyScreen extends React.Component {
  render() {
    return this.props.show ? (
      <div className="busyBackground">
        <div className="loadingCircle" />
        <div className="loadingCircleContent">
          <span className="fa fa-2x fa-calendar" />
        </div>
      </div>
    ) : null
  }
}
