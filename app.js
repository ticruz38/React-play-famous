//var fs = require('graceful-fs');
'use strict';

var Fluxible = require('fluxible');
var fetchrPlugin = require('fluxible-plugin-fetchr');

var app = new Fluxible({
    component: require('./components/routes.jsx')
});

app.plug(fetchrPlugin({
    xhrPath: '/api'
}));

app.registerStore(require('./stores/AmbrosiaStore'));
app.registerStore(require('./stores/authstore'));
app.registerStore(require('./stores/prostore'));

module.exports = app;
