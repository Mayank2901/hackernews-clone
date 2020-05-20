import React, { Component } from "react"
import Chart from 'chart.js';

var myChart;

class Graph extends Component{

    constructor(props){
        super(props)
        this.state = {
            x: props.xValues,
            y: props.yValues,
            myChart: ''
        }
    }

    componentDidMount(){
        var ctx = document.getElementById('myChart');
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.state.x,
                datasets: [{
                    label: '# of Votes',
                    data: this.state.y,
                    fill: false,
                    borderColor: "#6fcaef"
                }]
            },
            options: {
            }
        });
    }

    componentDidUpdate(props){
        myChart.destroy();
        var ctx = document.getElementById('myChart');
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: props.xValues,
                datasets: [{
                    label: '# of Votes',
                    data: props.yValues,
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

