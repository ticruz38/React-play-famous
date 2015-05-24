/*global logged, MainView, AuthView, MenuView, BodyView */

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
  var Engine = require('famous/core/Engine');
  var famousContext = Engine.createContext(document.body);
  window.famousContext = famousContext;
  var MainLayout = require('./famous-modifier/mainlayout');
  window.MainLayout =  new MainLayout();// share MainLayout in client code;

  var MenuLayout = require('./famous-modifier/menulayout');
  MenuLayout = new MenuLayout();
  window.MenuLayout = MenuLayout;

  var View = require('./famous-helpers/view');
  window.MainView = new View({
    element: document.getElementById('app')
  });
  window.AuthView = new View({element : document.querySelector('div.auth')});
  var HomeView = new View({
    element: document.querySelector('.home-page')
  });
  window.MenuView = new View({
    element: document.querySelector('.list')
  });
  window.BodyView = new View({
    element: document.querySelector('.body')
  });
  MainView.setChild([HomeView, MenuView]);
  MainView.setModifier(MenuLayout);
  HomeView.setModifier(window.MainLayout);
  famousContext.add(MainView);
  var Childs = [document.querySelector('h1.ambrosia'), AuthView, BodyView, document.querySelector('svg')];
  HomeView.setChild(Childs);

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
