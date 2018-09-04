import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { apply_history, connect_serviceworker, convert_postmessage } from 'STORE/actions.js'

import Calendar from './views/Calendar'
import Dashboard from './views/Dashboard'
import Notes from './views/Notes'
import React from 'react'
import { connect } from 'react-redux'
import { initServiceWorker } from 'UTILS/serviceWorker.js'

class App extends React.Component {
  componentDidMount() {
    // if (navigator.serviceWorker) {
    //   initServiceWorker()
    //     .then(subscription => {
    //       this.props.connect_serviceworker(subscription)
    //     })
    //     .catch(console.log)
    //   navigator.serviceWorker.addEventListener('message', this.props.convert_postmessage)
    // }
    // window.addEventListener('popstate', evt => {
    //   evt.state && this.props.apply_history(evt.state)
    // })
    //
    // if (history.state && history.state.app) {
    //   this.props.apply_history(history.state)
    // } else {
    //   history.replaceState({ app: { ...this.props.app } }, document.title, document.location.pathname)
    // }
  }

  render() {
    const { instance, user, app } = this.props
    return (
      <Router>
        <Switch>
          <Route path="/calendar" render={() => <Calendar />} />
          <Route path="/notes" render={() => <Notes />} />
          <Route path="/" render={() => <Dashboard />} />
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
