import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { apply_history, connect_serviceworker, convert_postmessage } from 'STORE/actions.js'

import Dashboard from './views/Dashboard'
import React from 'react'
import { connect } from 'react-redux'

class App extends React.Component {
  render() {
    const { instance, user, app } = this.props
    return (
      <Router>
        <Switch>
          {/* <Route path="/image" render={() => <Slider />} /> */}
          {/* <Route path="/gallery" render={() => <Gallery />} /> */}
          <Route path="/" exact render={() => <Dashboard />} />
          <Redirect to="/" />
        </Switch>
      </Router>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  app: state.app,
  instance: state.instance,
})

export default connect(
  mapStateToProps,
  { connect_serviceworker, convert_postmessage, apply_history },
)(App)
