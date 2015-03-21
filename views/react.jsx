var React = require('react/addons');
var data = require('../data/food.json');
var View = require('../helpers/view');

var Engine = require('famous/core/Engine');

var Context = Engine.createContext();

var IndexPage = React.createClass({

    getInitialState: function () {
        return {
            logged: false
        };
    },

    componentDidMount: function () {
        this.famous = new View({
            element : this.getDOMNode()
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
            <h1>Ambrosia</h1>
            <div> {logged} </div>
                <FoodEntityList>
                {this.props.datas.map(function (data) {
                    return <FoodEntity type = {data.type} />
                })}
                </FoodEntityList>
            </div>
        );
    }
});

var FoodEntityList =React.createClass({
    render: function () {
    return (
        <ul>
        {this.props.children}
        </ul>
        );
    }
})

var FoodEntity = React.createClass({
    render: function () {
        return (
        <div className = 'foodEntity-container'>
            <h1> {this.props.type} </h1>
            <img className = 'foodEntity-image' />
        </div>
        );
    }
});

React.render(
        <IndexPage datas = {data}/>,
        document.querySelector('.famous-container')
);

