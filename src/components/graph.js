import React, { Component } from "react"
import Chart from 'chart.js';

var myChart;

class Graph extends Component{

    constructor(props){
        super(props)
        console.log('constructor',props)
        this.state = {
            x: props.xValues,
            y: props.yValues,
            myChart: ''
        }
    }

    componentDidMount(){
        console.log('state',this.state.x,this.state.y,this.props)
        var ctx = document.getElementById('myChart');
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.props.xValues,
                datasets: [{
                    label: '# of Votes',
                    data: this.props.yValues,
                    fill: false,
                    borderColor: "#6fcaef"
                }]
            },
            options: {
            }
        });
    }

    componentDidUpdate(props){
        console.log('props',props.yValues,this.state.y,(JSON.stringify(props.yValues) !== JSON.stringify(this.state.y)))
        var ctx = document.getElementById('myChart');
        myChart.destroy();
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.props.xValues,
                datasets: [{
                    label: '# of Votes',
                    data: this.props.yValues,
                    fill: false,
                    borderColor: "#6fcaef"
                }]
            },
            options: {
            }
        });
    }

    render(){
        return(
            <canvas id="myChart" width="400" height="100"></canvas>
        )
    }


}

export default Graph;

