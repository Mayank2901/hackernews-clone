import React, { Component } from "react"
import Chart from 'chart.js';
import { connect } from "react-redux";

class Graph extends Component{

    constructor(props){
        super(props)
        this.state = {
        }
    }

    componentDidUpdate(props){
        var ctx = document.getElementById('myChart');
        var myChart = new Chart(ctx, {
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

