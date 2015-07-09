/*global logged*/

'use strict';
var React = require('react');
var debug = require('debug');
var bootstrapDebug = debug('Example');
var app = require('./app');
var dehydratedState = window.App;
var Router = require('react-router');
var HistoryLocation = Router.HistoryLocation;
var authAction = require('./actions/auth');

window.React = React; // for chrome dev tool support
debug.enable('*');

bootstrapDebug('rehydrating app', dehydratedState);

//famous stuff
  var View = require('./famous-helpers/view');
  var Engine = require('famous/core/Engine');
  var famousContext = Engine.createContext(document.body);
  window.famousContext = famousContext;
  window.Famous = View;


function RenderApp(context, Handler) {
    bootstrapDebug('React Rendering');
    var mountNode = document.getElementById('app');
    var Component = React.createFactory(Handler);
    //need to handle the fact that a men can be logged when refreshing
     React.render(Component({context:context.getComponentContext()}), mountNode, function () {//store are refreshing to initial state here
         bootstrapDebug('React Rendered');
     });
}
app.rehydrate(dehydratedState, function (err, context) {//here we get the plugin, csrf token.
    if (err) {
        throw err;
    }
    Router.run(app.getComponent(), HistoryLocation, function (Handler, state) {

        if (window.logged) {
              context.executeAction(authAction, logged, function() {
                RenderApp(context, Handler);
              });
        } else {
          RenderApp(context, Handler);
        }
    });
});
