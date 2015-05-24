var React = require('react/addons');
var data = require('../data/food.json');
var View = require('../helpers/view');
var gridLayout = require('../modifier/gridlayout');

var Engine = require('famous/core/Engine');

var Context = Engine.createContext();

var MainView = new View();
MainView.setModifier(gridLayout);


Context.add(MainView);

var IndexPage = React.createClass({

    getInitialState: function () {
        return {
            logged: false
        };
    },

    componentDidMount: function () {
        MainView.setElement(this.getDOMNode());
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
                {this.props.datas.map(function (data, index) {
                    console.log(index);
                    return <FoodEntity key = {index} type = {data.type} />
                })}
                </FoodEntityList>
            </div>
        );
    }
});

var FoodEntityList =React.createClass({

    render: function () {
    return (
        <div>
        {this.props.children}
        </div>
        );
    }
})

var FoodEntity = React.createClass({

    componentDidMount: function () {
    console.log('FoodEntity');
        MainView.setChild(this.getDOMNode());
    },

    render: function () {
        return (
        <div className = 'famous-surface'>
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

