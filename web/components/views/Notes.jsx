import { Redirect, Route, Switch } from 'react-router-dom'

import DefaultPage from 'CONNECTED/DefaultPage'
import React from 'react'

const validateId = id => {
  return /^n_[0-9]*$/.test(id)
}

export default class Notes extends React.Component {
  render() {
    return (
      <DefaultPage>
        <Switch>
          <Route path="/notes/" exact render={() => <div>home</div>} />
          <Route path="/notes/new" render={() => <div>new</div>} />
          <Route path="/notes/:id" render={({ match: { params } }) => (validateId(params.id) ? <div>{params.id}</div> : <Redirect to="/notes/" />)} />
        </Switch>
      </DefaultPage>
    )
  }
}
