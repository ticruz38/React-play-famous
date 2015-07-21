/**
 * React class to handle the rendering of the HTML head section
 *
 * @class Head
 * @constructor
 */
 'use strict';
var React = require('react');
//var AmbrosiaStore = require('../stores/AmbrosiaStore');
var FluxibleMixin = require('fluxible').FluxibleMixin;

var Html = React.createClass({
    mixins: [FluxibleMixin],

    /**
     * Refer to React documentation render
     *
     * @method render
     * @return {Object} HTML head section
     */
    render: function() {
        return (
            <html>
            <head>
                <meta charSet="utf-8" />
                <title></title>
                <meta name="viewport" content="width=device-width, user-scalable=no" />
                <link rel="stylesheet" href="/stylesheets/ambrosia.css" />
                <link rel='stylesheet' href='/stylesheets/famous.css' />
            </head>
            <body>
                <div id="app" className='' dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
            </body>
            <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
            <script src="/dist/bundle.js" defer></script>
            </html>
        );
    }
});

module.exports = Html;
