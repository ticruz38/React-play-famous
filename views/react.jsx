var React = require('react/addons');
var data = require('../data/food.json');

var IndexPage = React.createClass({

    getInitialState: function () {
        return {
            logged: false
        };
    },

    componentDidMount: function () {

    },

    onClickLogged: function () {
        logModal.setState({
            open: true
        });
    },

    render: function () {
        var logged = logged ? 'Log Out' : 'Log In';
        return ( < div >
            <h1> Ambrosia < /h1> <div> {logged} </div> < div className = 'container' > {
                this.props.food.entities.map(function (type) {
                    var child = <FoodEntity data = {type} />
                    return React.addons.createFragment({a: <div/> , b: child});
                })
            } </div>
            </div>
        );
    }
});

var FoodEntity = React.createClass({
    render: function () {
        console.log(this.props);
        return (
        <div className = 'foodEntity-container'>
            <h1> Yepoo </h1> <img className = 'foodEntity-image' />
        </div>
        );
    }
});

var Index = React.render(
        <IndexPage food = {data[0]}/>,
        document.body
        );

React.Children.count(Index);
/*
React.Children.map(Index, function(child){
});
*/
