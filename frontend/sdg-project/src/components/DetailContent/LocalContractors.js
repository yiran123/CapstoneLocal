import React, { Component } from 'react'
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'

class LocalContractor extends Component {
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
let margin = {top: 20, right: 0, bottom: 30, left: 0};
let svgWidth = 541, svgHeight = 362;
let height = svgHeight- margin.top- margin.bottom, width = svgWidth - margin.left - margin.right;
let sourceNames = [], sourceCount = [];
const color = "#C0CEDB";
const topColor = '#ABC24D';


let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);
for(let key in data){
    if(data[key].name.length > 0) {
        sourceNames.push(data[key].name);
        sourceCount.push(data[key].value);}
    
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

// svg.append("g")
//     .attr("class", "axis axis--y")
//     .call(d3.axisLeft(y).ticks(5))
//     ;
        
// Create rectangles
let bars = svg.selectAll('.bar')
    .data(data)
    .enter()
    .append("g");

bars.append('rect')
    .attr('class', 'bar')
    .attr("fill", (d,i) => {return i<2?topColor:color})
    .attr("x", d => { return x(d.name); })
    .attr("y", d => { return y(d.value); })
    .attr("width", x.bandwidth())
    .attr("height", d => { return height - y(d.value); });
    
bars.append("text")
    .text(d => { 
        return d.value;
    })
    .attr("x", d => {
        return x(d.name) + x.bandwidth()/2;
    })
    .attr("y", d => {
        return y(d.value) - 5;
    })
    .attr("font-family" , "sans-serif")
    .attr("font-size" , "14px")
    .attr("fill" , "black")
    .attr("text-anchor", "middle");



   }

render() {
          return <svg ref={node => this.node = node}
      width={541} height={362}>
      </svg>
   }
}
export default LocalContractor


 