import React from 'react';
import styled from 'styled-components'
import _ from 'lodash'
import { unsdgs } from '../Filter/const'

import './SdgsAlignment.css'






const SdgsAlignmentItemWrapper = styled.div`
  display: flex;
  margin-bottom: 6px;
  cursor: pointer;
`

const ShowTotalLabel = styled.div`
  width: ${props => props.width}%;
  
  height: 56px;
  line-height: 56px;
  padding: 0 8px;
`


Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

class SdgsAlignment extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      sdgsAlignment: [{value: 0, total:0, showTotal:''}],
      sdgs: 'all',
      selected: {}
    }
    this.createData = this.createData.bind(this);
    this.numberWithCommas = this.numberWithCommas.bind(this);
    this.getWidth = this.getWidth.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  getWidth = (width, temp) => {
  const maxWidth = _.maxBy(temp, (sdg) => sdg.total).total
  // console.log('maxWidth', Number.parseInt(width / maxWidth * 100))

  return Number.parseInt(width / maxWidth * 100)
}
  onChange(item) {
    var temp = this.state.sdgs;
    if(this.state.selected.value == item.value) {
      temp = 'all';
    }else{
      temp = 'part';
    }
    if(temp == 'all') {
      this.setState({sdgs:temp, selected: {} })
    }
    else {
          this.setState({sdgs:temp, selected: item })
    }

    this.props.changeFilter(temp, item)
  }

  createData() {
    var array =[];
    this.props.projects.forEach((project)=>{
      array = array.concat(project.sdgs).unique();
    })
    var result = [];
     array.forEach((item) => {
      result.push({value: item, total: 0});
     })
    array.forEach((item) => {
       this.props.projects.forEach(( project )=>{
          if(project.sdgs.includes(item)) {
            var temp = result.filter(obj => {
              return obj.value === item
            })
            temp[0].total += project.use_of_proceeds;
            temp[0].showTotal = '$'+this.numberWithCommas(temp[0].total);
          }
       })
    })

   // this.setState({sdgsAlignment:result});
    return result;
  
  }
   numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  render (){
    var temp = this.createData();
    var self = this;
  return (
    <div className="SdgsAlignment">
      {
        

        temp.map(sdg => {
          return <SdgsAlignmentItemWrapper onClick={()=>self.onChange(sdg)}>
            <img width="56" height="56" src={unsdgs[sdg.value]} alt='sdg' />
            <ShowTotalLabel className = {`sdg-filter-item ${this.state.sdgs == 'part' && this.state.selected.value == sdg.value ? 'active' : ''}`} width={this.getWidth(sdg.total, temp)}>{sdg.showTotal}</ShowTotalLabel>
          </SdgsAlignmentItemWrapper>
        })
      }

    </div >
  );
}
}

export default SdgsAlignment;