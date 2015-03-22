var React = require('react/addons');
var data = require('../data/food.json');
var View = require('../helpers/view');
var gridLayout = require('../modifier/gridlayout');

var Engine = require('famous/core/Engine');

var Context = Engine.createContext();

var Home = React.createClass({

    getInitialState: function () {
        return {
            logged: false,
            input: null,
            client: true,
        }
    },

    render: function () {
    var list = this.state.input ? <FoodEntityList data = {this.state.data}/> : '';
    var logged = this.state.logged ? 'Log Out' : 'Log In';
    var windowSize = window.innerWidth;
    var navbarHeight = window.innerHeight * 0.1;
    var logSize = [window.innerWidth * 0.1, window.innerHeight * 0.02];
    console.log(navbarHeight);
        return (
            <div>
                <div className = 'navbar' style={{height: navbarHeight}}>
                    <h1 className = 'ambrosia' style={{fontSize: navbarHeight}}>Ambrosia</h1>
                </div>
                <span className = 'log' style={{width: logSize[0], height: logSize[1]}}> <p>{logged}</p> </span>
                <input className = 'famous-surface search' type= 'text' style = {{width: windowSize/5, height: windowSize/20}}/>
            {list}
            </div>
        )
    }
});

React.render(
        <Home/>,
        document.querySelector('.famous-container')
        );
