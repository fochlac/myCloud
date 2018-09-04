import { Redirect, Route, Switch } from 'react-router-dom'

import { default as CalenderBase } from 'CONNECTED/Calendar'
import DefaultPage from 'CONNECTED/DefaultPage'
import React from 'react'

const validateId = id => /^[eb]_[0-9]*$/.test(id)

export default function Calendar() {
  return (
    <DefaultPage>
      <Switch>
        <Route path="/calendar/" exact component={CalenderBase} />
        <Route path="/calendar/new" render={() => <div>new</div>} />
        <Route path="/calendar/:id" render={({ match: { params } }) => (validateId(params.id) ? <div>{params.id}</div> : <Redirect to="/calendar/" />)} />
      </Switch>
    </DefaultPage>
  )
}
