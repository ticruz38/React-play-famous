/*jslint node: true */
'use strict';
var React = require('react');

    var List = React.createClass({
      getInitialState: function () {
        return {};
      },
      render: function() {
        return (
          <p>This should be the Restaurants listed</p>
        );
      }
    });

module.exports = List;
