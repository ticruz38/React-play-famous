'use strict';
var React = require('react');
var Route = require('react-router').Route;
var DefaultRoute = require('react-router').DefaultRoute;
var Home = require('./home.jsx');
var Professional = require('./professional-ui');
var Open = require('./openarestaurant.jsx');
var Welcome = require('./welcome.jsx');

var routes = (
  <Route name="app" path="/" handler={Home}>
    <Route name='professional-ui' path='/professional' handler={Professional}/>
    <Route path='/open/1st-step' handler={Open.firstStep}/>
    <Route path='/open/2nd-step' handler={Open.secondStep}/>
    <Route path='/open/3rd-step' handler={Open.thirdStep}/>
    <DefaultRoute name='welcome' handler={Welcome}/>
  </Route>
);

module.exports = routes;
