import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { loadGalleries } from 'STORE/actions.js'
import ImmuTypes from 'immutable-prop-types'
import PropTypes from 'prop-types'

import Gallery from './views/Gallery'
import Slideshow from './views/Slideshow'
import Dashboard from './views/Dashboard'
import BusyScreen from 'RAW/BusyScreen'
import DefaultPage from 'RAW/DefaultPage'
import React from 'react'
import { connect } from 'react-redux'

class App extends React.Component {
  render() {
    const { app } = this.props
    const busy = app.get('busy').includes('APP_ROOT')

    if (busy) {
      return (
        <Router>
          <DefaultPage>
            <BusyScreen />
          </DefaultPage>
        </Router>
      )
    }

    return (
      <Router>
        <Switch>
          <Route
            path="/gallery/:id/slideshow"
            render={({ match: { params }, location: { search } }) => (
              <Slideshow params={params} image={extractQuery(search, 'image')} />
            )}
          />
          <Route
            path="/gallery/:id"
            render={({ match: { params } }) => <Gallery params={params} />}
          />
          <Route path="/" exact render={() => <Dashboard />} />
          <Redirect to="/" />
        </Switch>
      </Router>
    )
  }
}

App.propTypes = {
  app: ImmuTypes.map.isRequired,
  loadGalleries: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  app: state.get('app'),
})

export default connect(
  mapStateToProps,
  dispatch => ({ loadGalleries: () => dispatch(loadGalleries()) }),
)(App)

function extractQuery(search, param) {
  const query = new URLSearchParams(search)
  return query.get(param)
}
