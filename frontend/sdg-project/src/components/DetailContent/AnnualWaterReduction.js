import React, { Component } from 'react'
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'

class AnnualWaterReduction extends Component {
    constructor(props){
        super(props)
        this.createBarChart = this.createBarChart.bind(this)
    }

    componentDidMount() {
        this.createBarChart()
    }
    componentDidUpdate() {
        this.createBarChart()
    }


    createBarChart() {

        let data = this.props.data;
        let margin = {top: 30, right: 0, bottom: 30, left: 0};
        let svgWidth = 445.2, svgHeight = 290.65;
        let height = svgHeight- margin.top- margin.bottom, width = svgWidth - margin.left - margin.right;
        let sourceNames = [], sourceCount = [];
        const color = "#ABC24D";


        let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);
        for(let key in data){
            if(data.hasOwnProperty(key)){
                sourceNames.push(key);
                sourceCount.push(parseInt(data[key]));
            }
        }
        x.domain(sourceNames);
        y.domain([0, d3.max(sourceCount, function(d) { return d; })]);

        let svg = select(this.node).append("svg");
        svg.attr('height', svgHeight)
            .attr('width', svgWidth);

        svg = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Create rectangles
        let bars = svg.selectAll('.bar')
            .data(sourceNames)
            .enter()
            .append("g");

        bars.append('rect')
            .attr('class', 'bar')
            .attr("x", function(d) { return x(d); })
            .attr("y", function(d) { return y(data[d]); })
            .attr("fill", color)
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(data[d]); });
            
        bars.append("text")
            .text(function(d) { 
                return data[d];
            })
            .attr("x", function(d){
                return x(d) + x.bandwidth()/2;
            })
            .attr("y", function(d){
                return y(data[d]) - 5;
            })
            .attr("font-family" , "Roboto")
            .attr("font-size" , "14px")
            .attr("fill" , "black")
            .attr("text-anchor", "middle");
   }

    render() {
        return <svg ref={node => this.node = node} width={445.2} height={290.65}></svg>
    }
}
export default AnnualWaterReduction


 