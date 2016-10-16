import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import App from './components/app';
import Mps from './components/mps';
import MpDetails from './components/mp-details';
import Parties from './components/parties';
import PartyDetails from './components/party-details';
import NotFound from './components/not-found';

const Routes = (props) => (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="/thingmenn" component={Mps} />
    <Route path="/thingmenn/:mpId" component={MpDetails} />
    <Route path="/thingflokkar" component={Parties} />
    <Route path="/thingflokkar/:partyId" component={PartyDetails} />
    <Route path="*" component={NotFound} />
  </Router>
);

export default Routes;
