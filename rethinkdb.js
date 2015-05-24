var bodyParser = require('body-parser');
var r = require('rethinkdb');
var config = require('./config');

function rethinkdb(server) {
    server.use(bodyParser.json()); // Parse data sent to the server
    server.use(createConnection); // Create a RethinkDB connection
    //server.route('/users/get').get(get); // Retrieve all the users
    server.route('/users/new').put(create); // Create a new users
    // server.route('/users/update').post(update); // Update a users
    // server.route('/users/delete').post(del); // Delete a users

    server.use(closeConnection);
    initializeRethinkDb(server); //it start express server at the right time as well
}

function create(req, res, next) {
    var users = req.body;         // req.body was created by `bodyParser`

    r.table('users').insert(users, {returnChanges: true}).run(req._rdbConn, function(error, result) {
        if (error) {
            handleError(res, error);
        }
        else if (result.inserted !== 1) {
            handleError(res, new Error("Document was not inserted."));
        }
        else {
            res.send(JSON.stringify(result.changes[0].new_val));
        }
        next();
    });
}

function createConnection(req, res, next) {
    r.connect(config.rethinkdb, function(error, conn) {
        if (error) {
            handleError(res, error);
        } else {
            // Save the connection in `req`
            req._rdbConn = conn;
            // Pass the current request to the next middleware
            next();
        }
    });
}

function closeConnection(req, res, next) {
    req._rdbConn.close();
    next();
}

function startExpress(server) {
    var port = process.env.PORT || config.express.port;
    server.listen(port);
    console.log('Listening on port ' + port);
}

function handleError(res, error) {
    return res.send(500, {
        error: error.message
    });
}

function initializeRethinkDb(server) {

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
}

module.exports = rethinkdb;
