import React, { Component } from "react"
import Chart from 'chart.js';

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
        var { myChart } = this.state.myChart
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
        this.setState({
            myChart : myChart
        })
        
    }

    componentDidUpdate(props){
        console.log('props',props,this.state.x,this.state.y)
        var { myChart } = this.state.myChart
        var ctx = document.getElementById('myChart');
        if((JSON.stringify(props.xValues) !== JSON.stringify(this.state.x)) || (JSON.stringify(props.yValues) !== JSON.stringify(this.state.y))){
            console.log('updating')
            // myChart.destroy();
            // myChart = new Chart(ctx, {
            //     type: 'line',
            //     data: {
            //         labels: this.props.xValues,
            //         datasets: [{
            //             label: '# of Votes',
            //             data: this.props.yValues,
            //             fill: false,
            //             borderColor: "#6fcaef"
            //         }]
            //     },
            //     options: {
            //     }
            // });
            myChart.data.labels.push(props.xValues);
            myChart.data.datasets.forEach((dataset) => {
                dataset.data.push(props.yValues);
            });
            myChart.update()
            this.setState({
                x: props.xValues,
                y: props.yValues,
                myChart : myChart
            })
        }
    }

    render(){
        return(
            <canvas id="myChart" width="400" height="100"></canvas>
        )
    }


}

export default Graph;

