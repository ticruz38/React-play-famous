var r = require('rethinkdb');
var config = require(__dirname+'/config.js');

var API = {};

API.createConnection = function(req, res, next) {
    r.connect(config.rethinkdb, function(error, conn) {
        if (error) {
            handleError(res, error);
        }
        else {
            req._rdbConn = conn;
            next();
        }
    });
};

API.closeConnection = function(req, res, next) {
    req._rdbConn.close();
};

// @params: req

API.getUser = function (req, cb) {
  r.table('users').get(req.session.logged).run(req._rdbConn, function(err, result) {
    if(err) throw err;
    var details = {};
    details.loginDetails = {};
    details.loginDetails.mail = result.mail;
    details.handler = null;
    details.logged = true;
    if(result.pseudo) details.loginDetails.pseudo = result.pseudo;
    if(result.avatar) details.loginDetails.avatar = result.avatar;
    cb(details);
  });
};
// create tables/indexes then start express

API.start = function (server){

  console.log(config.rethinkdb);

    r.connect(config.rethinkdb, function(err, conn) {
        if (err) {
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


                        console.log("Table is available, starting express...");

                        startExpress(server);
                        conn.close();
                    });
                });
            } else {
                console.log("Table and index are available, starting express...");
                startExpress(server);
            }
        });

    });
};
function startExpress(server) {
    var port = process.env.PORT || config.express.port;
    server.listen(port);
    console.log('Listening on port ' + port);
}

/*
 * Send back a 500 error
 */
function handleError(res, error) {
    return res.send(500, {error: error.message});
}

module.exports = API;
