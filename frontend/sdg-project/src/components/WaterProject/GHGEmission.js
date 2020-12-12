import React, { Component } from 'react'
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'

class GHGEmission extends Component {
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
  
  var models = this.props.data;


var container = d3.select(this.node),
    width = 545,
    height = 253.54,
    margin = {top: 20, right: 0, bottom: 30, left: 0},
    barPadding = .2,
    axisTicks = {qty: 5, outerSize: 0, dateFormat: '%m-%d'};

var svg = container
   .append("svg")
   .attr("width", width)
   .attr("height", height)
   .append("g")
   .attr("transform", `translate(${margin.left},${margin.top})`);

var xScale0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(barPadding);
var xScale1 = d3.scaleBand();
var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
var yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);

xScale0.domain(models.map(d => d.year));
xScale1.domain(['baseline', 'actual']).range([0, xScale0.bandwidth()]);
yScale.domain([0, d3.max(models, d => d.baseline > d.actual ? d.baseline : d.actual)]);

var year = svg.selectAll(".year")
  .data(models)
  .enter().append("g")
  .attr("class", "year")
  .attr("transform", d => `translate(${xScale0(d.year)},0)`);

/* Add field1 bars */  
var bar1 = year.selectAll(".bar.baseline")  
  .data(d => [d])
  .enter()
  .append("g");

  bar1.append("rect")
  .attr("class", "bar baseline")
.style("fill","#7A961F")
  .attr("x", d => xScale1('baseline'))
  .attr("y", d => yScale(d.baseline))
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.baseline)
  });

  bar1.append("text")
    .text(d => { 
        return d.baseline;
    })
    .attr("x", d => {
        return xScale1.bandwidth()/2;
    })
    .attr("y", d => {
        return yScale(d.baseline) - 5;
    })
    .attr("font-family" , "Roboto")
    .attr("font-size" , "14px")
    .attr("fill" , "black")
    .attr("text-anchor", "middle");
  
/* Add field2 bars */
var bar2 = year.selectAll(".bar.actual")
  .data(d => [d])
  .enter();

  bar2.append("rect")
  .attr("class", "bar actual")
.style("fill","#EA7926")
  .attr("x", d => xScale1('actual'))
  .attr("y", d => yScale(d.actual))
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.actual)
  });

    bar2.append("text")
    .text(d => { 
        return d.actual;
    })
    .attr("x", d => {
      return xScale1.bandwidth()*1.5;
    })
    .attr("y", d => {
        return yScale(d.actual) - 5;
    })
    .attr("font-family" , "Roboto")
    .attr("font-size" , "14px")
    .attr("fill" , "black")
    .attr("text-anchor", "middle");
 
// Add the X Axis
svg.append("g")
   .attr("class", "x axis")
   .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
   .call(xAxis);

// Add the Y Axis

   }



render() {
  return <svg ref={node => this.node = node}
    width={545} height={253.54}>
      </svg>
   }
}
export default GHGEmission;


