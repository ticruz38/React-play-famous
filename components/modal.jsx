'use strict';

var React = require('react');

var logModal = React.createClass({
    getInitialState: function() {
        return {
            open: false
        };
    },

    render: function() {
        var openstate = open ? 'open' : 'close';
        return (
            <div class = 'log-modal {{openstate}}' >
            < form >
            < input type = 'text' placeholder = "pseudo ou mail"/>
            < input type = 'password' placeholder = 'password'/>
            </form>
            </div>
        );
    }
});

module.exports = logModal;
