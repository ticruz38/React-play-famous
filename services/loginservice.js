'use strict';

var r = require('rethinkdb');
//var config = require('./config'); not used

/*
 * Send back a 500 error
 */
// function handleError(res, error) {
//     return res.send(500, {
//         error: error.message
//     });
// }

module.exports = {
    name: 'login',
    // at least one of the CRUD methods is required
    read: function(req, resource, params, config, callback) {
        if (params.password) {
            r.table('users').filter(function(user) {
                return (user('mail').eq(params.pseudo)
                        .or(user('pseudo').eq(params.pseudo)))
                    .and(user('password').eq(params.password));
            }).run(req._rdbConn, function(error, cursor) {
                if (error) throw error;
                if (cursor.length === 0) {
                    callback(null, cursor = 'you messed up with pseudo or password');
                }
                cursor.each(function(err, user) {
                    if (err) throw err;
                    req.session.logged = user.id;
                    callback(null, user);
                });
            });
        } else {
          r.table('users').get(params.id).run(req._rdbConn, function (err, result) {
            if(err) throw err;
            callback(null, result);
          });
        }
    },
    create: function(req, resource, params, body, config, callback) {
        r.table('users').filter({
            mail: params.mail
        }).run(req._rdbConn, function(error, cursor) {
            cursor.toArray(function(err, result) {
                if (!result.length) { //if there is no such mail address allready, populate the db
                    r.table('users').insert(params).run(req._rdbConn, function(error, result) {
                        delete params.password;
                        delete params.confirmPassword; //remove password field so it's not shared on the client
                        if (error) {
                            callback(error, result);
                        } else { //insert is successfull user is logged-in, we store the id in req.session
                            req.session.logged = result.generated_keys[0];
                            callback(null, result);
                        }
                    });
                } else {
                    result = {
                        errors: {
                            emailUsed: 'that email address is used allready'
                        }
                    };
                    callback(error, result);
                }
            });
        });
    }
};
// update: function(resource, params, body, config, callback) {},
// delete: function(resource, params, config, callback) {}


// the callback which handle error with normal server side code on create
// if (error) {
//     handleError(res, error)
// }
// else if (result.inserted !== 1) {
//     handleError(res, new Error("Document was not inserted."))
// }
// else {
//     res.send(JSON.stringify(result.new_val));
// }
// next();
