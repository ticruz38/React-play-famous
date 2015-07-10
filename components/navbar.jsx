'use strict';

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Auth = require('./auth.jsx');
var SvgButton = require('./svgbutton.jsx');

var Navbar = React.createClass({

    render: function() {
      return (
      <div className = 'navbar'>
        <SvgButton/>
        <h1 className='ambrosia'><Link to='/'>Ambrosia</Link></h1>
        <Auth/>
      </div>
      );
    }
});

module.exports = Navbar;
