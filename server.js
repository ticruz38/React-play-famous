
require('babel/register');
var express = require('express');
var React = require('react');
var bodyParser = require('body-parser');
var csrf = require('csurf');
var session = require('express-session');
var authAction = require('./actions/auth');
// serialize = require('serialize-javascript'); replaced by express-state
var expressState = require('express-state');
var debug = require('debug')('Example');

//fluxible stuff
var app = require('./app');
var HtmlComponent = React.createFactory(require('./components/Html.jsx'));

var Router = require('react-router');
var rethinkdbAPI = require('./rethinkdbAPI');

var server = express();
expressState.extend(server);

// server.use('/', express.static(__dirname));
server.use('/build', express.static(__dirname + '/build'));
server.use('/styles', express.static(__dirname + '/stylesheets'));
server.use('/public', express.static(__dirname + '/public'));
server.use(bodyParser.json());

// Get access to the fetchr plugin instance
var fetchrPlugin = app.getPlugin('FetchrPlugin');
// Register our messages REST service
fetchrPlugin.registerService(require('./services/loginservice'));
// Middleware that will create a connection to the database
server.use(rethinkdbAPI.createConnection);
//set up a session
server.use(session({
  secret: 'chuuuut',
  resave: false,
  saveUninitialized: false
}));

// Set up the fetchr middleware
server.use(fetchrPlugin.getXhrPath(), csrf(), fetchrPlugin.getMiddleware());

server.use(csrf(), function (req, res, next) {
  //fetchrplugin depends on this
  var context = app.createContext({
    req: req,
    xhrContext: {
      _csrf: req.csrfToken()
    }
  });
  // if(req.session.logged) {
  //     rethinkdbAPI.getUser(req, function (result) {
  //       console.log('rethinkdbAPI', result);
  //       context.executeAction(authAction, result);
  //   });
  // }

  debug('Executing navigate action');

Router.run(app.getComponent(), req.path, function (Handler, state) {
      debug('Exposing context state');
        if(req.session.logged) res.expose(req.session.logged, 'logged');
        res.expose(app.dehydrate(context), 'App');
        debug('Rendering Application component into html');
        function sendHtml() {
          var Component = React.createFactory(Handler);
          var html = React.renderToStaticMarkup(HtmlComponent({
                  state: res.locals.state,
                  markup: React.renderToString(Component({
                    context:context.getComponentContext(),
                  }))
              }));
          debug('Sending markup');
          res.send(html);
          next();
        }
        if(req.session.logged) {
            context.executeAction(authAction, req.session.logged, function() {
              sendHtml();
          });
        } else {
          sendHtml();
        }
      });
});

// Middleware to close a connection to the database
// allways pass this one as the very last middleware
server.use(rethinkdbAPI.closeConnection);


// create the tables if not yet created then start node server
rethinkdbAPI.start(server);
