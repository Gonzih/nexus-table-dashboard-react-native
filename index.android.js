/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');

var {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
} = React;

var Item = React.createClass({
    cs: '℃',

    parseTime: function() {
        return moment(this.props.data.dt, 'X')
    },
    formatDate: function() {
        return this.parseTime().format('DD/MM')
    },
    formatTime: function() {
        return this.parseTime().format('HH:mm')
    },
    getImageUrl: function() {
        return "http://openweathermap.org/img/w/" + this.props.data.weather[0].icon + ".png"
    },
    render: function() {
        return(
            <View style={styles.items.wrapper}>
                <Text style={styles.items.text}>{this.formatDate()}</Text>
                <Text style={styles.items.text}>{this.formatTime()}</Text>
                <Image source={{uri: this.getImageUrl()}} style={styles.items.image} />
                <Text style={styles.items.text}>{this.props.data.main.temp_min}{this.cs} - {this.props.data.main.temp_min}{this.cs}</Text>
            </View>
        )
    }
});

var Error = React.createClass({
    render: function() {
        return(
            <View><Text>{this.props.error}</Text></View>
        )
    }
});

var NexusDashboard = React.createClass({
    getInitialState: function() {
        return {data: null, error: null}
    },
    generateItems: function () {
        return _.chain(this.state.data.list).slice(0, 9).map(function(slot) {
            return(<Item data={slot} />)
        }).value()
    },
    fetchData: function() {
        fetch('http://api.openweathermap.org/data/2.5/forecast?q=Haarlem,nl&mode=json&units=metric')
                         .then((response) => response.text())
                         .then((text)     => this.setState({data: JSON.parse(text)}))
                         .catch((error)   => {this.setState({error: error})})
    },
    getGeoData: function() {
        navigator.geolocation.getCurrentPosition((position) => this.setState({position: position}),
                                                 (error)    => this.setState({error: error}),
                                                 {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
    },
    componentDidMount: function() {
        this.fetchData();
    },
    render: function() {
        if (this.state.data) {
            return (
                <View style={styles.main.container}>
                    <View style={styles.title.container}>
                      <Text style={styles.title.text}>{this.state.data.city.name}</Text>
                <Text>{this.state.position}</Text>
                    </View>
                    <View style={styles.items.container}>
                    {this.generateItems()}
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.title.container}><Text style={styles.title.text}>Waiting for data</Text></View>
            )
        }
    }
});

var styles = {};

styles.main = StyleSheet.create({
    container: {
    },
});

styles.title = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        margin: 10,
    }
});

styles.items = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    wrapper: {
        flexDirection: 'column',
        padding: 5,
        width: 112,
        borderBottomWidth: 1,
        borderColor: '#888888',
        justifyContent: 'center',
    },
    image: {
        width: 100,
        height: 80,
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
        margin: 5,
    }
});

AppRegistry.registerComponent('NexusDashboard', () => NexusDashboard);
