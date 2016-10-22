import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import analytics from './utility/analytics'

import App from './components/app'
import Mps from './components/mps'
import MpDetails from './components/mp-details'
import Parties from './components/parties'
import PartyDetails from './components/party-details'
import About from './components/about'
import NotFound from './components/not-found'

let lastState

function onRouterUpdate() {
  const { action, pathname } = this.state.location

  const lastPathname = lastState ? lastState.pathname : null
  const navigatingToNewPath = lastPathname !== pathname

  if (navigatingToNewPath) {
    analytics.pageview(pathname)
    console.log('New path, sent page view')
  }

  if (action === 'PUSH' && navigatingToNewPath) {
    window.scrollTo(0, 0)
  }

  lastState = this.state.location
}

const Routes = (props) => (
  <Router onUpdate={onRouterUpdate} history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Mps} />
      <Route path="/thingmenn/:mpId" component={MpDetails} />
      <Route path="/thingflokkar" component={Parties} />
      <Route path="/thingflokkar/:partyId" component={PartyDetails} />
      <Route path="/um" component={About} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
)

export default Routes;
