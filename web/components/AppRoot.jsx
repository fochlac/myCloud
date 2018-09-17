import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import BusyScreen from 'RAW/BusyScreen'
import Dashboard from './views/Dashboard'
import DefaultPage from 'RAW/DefaultPage'
import Gallery from './views/Gallery'
import ImmuTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import React from 'react'
import Slideshow from './views/Slideshow'
import { connect } from 'react-redux'
import { loadGalleries } from 'STORE/actions.js'

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
          <Redirect to={app.get('startGallery') ? `/gallery/${app.get('startGallery')}` : '/'} />
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
