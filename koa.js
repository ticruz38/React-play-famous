
import 'babel/register';
import koa from 'koa';
import qs from 'koa-qs';
import serve from 'koa-static';
import koaRouter from 'koa-router';
import parseBody from 'co-body';

import {graphql} from 'graphql';
import schema from './schema';

//my HTML stuffs
import React from 'react';
import Router from 'react-router';
import serialize from 'serialize-javascript';
import app from './app';

//my rethinkdb stuff
import r from 'rethinkdb';
import config from './config';

let routes = new koaRouter();
let port = process.env.PORT || 3000;
var server = koa();

// support nested query string params
qs(server);

server.use(serve(__dirname));

server.use(function *(next) {
  yield r.connect(config.rethinkdb, function(error, conn) {
    if (error) {
      console.log(error);
    } else {
      this._rdbConn = conn;
    }
  }.bind(this));
  yield next;
});

server.use(function *(next) {
  var context = app.createContext({
    req: this.req,
  });
  var exposed = 'window.App=' + serialize(app.dehydrate(context), 'App');
  var path = this.path;
  var Handler = Router.run(app.getComponent(), path, function (handler, state) {
    return handler;
  });
  function sendHtml () {
    var HtmlComponent = React.createFactory(require('./components/Html.jsx'));
    var Component = React.createFactory(Handler);
    var html = React.renderToStaticMarkup(HtmlComponent({
      state: exposed,
      markup: React.renderToString(Component({
        context: context.getComponentContext()
      }))
    }));
    return html;
  }
  var html = sendHtml();
  yield next;
  this.body = html;
});

server.use(function *(next) {
  this._rdbConn.close();
  yield next;
});


routes.get('/data', function* () {
  var query = this.query.query;
  var params = this.query.params;

  var resp = yield graphql(schema, query, '', params);

  if (resp.errors) {
    this.status = 400;
    this.body = {
      errors: resp.errors
    };
    return;
  }

  this.body = resp;
});

routes.post('/data', function* () {
  var payload = yield parseBody(this);
  var resp = yield graphql(schema, payload.query, '', payload.params);

  if (resp.errors) {
    this.status = 400;
    this.body = {
      errors: resp.errors
    };
    return;
  }

  this.body = resp;
});

server.use(routes.middleware());

r.connect(config.rethinkdb, function(err, conn) {
  if(err) {
    console.log("Could not open a connection to initialize the database");
    console.log(err.message, conn);
    process.exit(1);
  }
  r.table('users').run(conn, function(err, result) {
      if (err) {
          // The database/table/index was not available, create them

          r.dbCreate(config.rethinkdb.db).run(conn, function(err, result) {
              if ((err) && (!err.message.match(/Database `.*` already exists/))) {
                  console.log("Could not create the database `" + config.db + "`");
                  console.log(err);
                  process.exit(1);
              }
              console.log('Database `' + config.rethinkdb.db + '` created.');

              r.tableCreate('users').run(conn, function(err, result) {
                  if ((err) && (!err.message.match(/Table `.*` already exists/))) {
                      console.log("Could not create the table `users`");
                      console.log(err);
                      process.exit(1);
                  }
                  console.log('Table `users` created.');


                  console.log("Table is available, starting koa...");

                  server.listen(port, () => {
                    console.log('app is listening on ' + port);
                  });
                  conn.close();
              });
          });
      } else {
          console.log("Table and index are available, starting koa...");
          server.listen(port, () => {
            console.log('app is listening on ' + port);
          });
      }
  });
});

module.exports = server;
