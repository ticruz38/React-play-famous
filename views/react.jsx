var React = require('react/addons');
var data = require('../data/food.json');
var View = require('../helpers/view.js');

var Engine = require('../famous/core/Engine.js');
var Context = Engine.createContext();

console.log(Engine, Context);

var IndexPage = React.createClass({

    getInitialState: function () {
        return {
            logged: false
        };
    },

    componentDidMount: function () {
        this.famous = new View({
            element: this.getDOMNode()
        });
        Context.add(this.famous);
    },

    onClickLogged: function () {
        logModal.setState({
            open: true
        });
    },

    render: function () {
        var logged = logged ? 'Log Out' : 'Log In';
        return ( < div >
            < h1 > Ambrosia < /h1> < div > {
                logged
            } < /div> < div className = 'container' >
            < FoodEntityList > {
                this.props.data.map(function (dat) {
                    return <FoodEntity type = {dat.type} />
                })
            } </FoodEntityList>
            </div>
            </div>
        );
    }
});

var FoodEntityList = React.createClass({
    render: function () {
        return ( < div className = 'foodEntityList' > {this.props.children}
        < /div>
        );
    }
});

var FoodEntity = React.createClass({
    render: function () {
        return (
        < div className = 'foodEntity-container' >
            < h1 > {this.props.type}
            < /h1>
            <img className = 'foodEntity-image' />
        < /div>
        );
    }
});

React.render(<IndexPage data = {data} />, document.body);
