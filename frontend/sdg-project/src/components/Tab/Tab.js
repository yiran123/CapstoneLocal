import React, { useState } from 'react';
import ReactSwipe from 'react-swipe';
import styled from 'styled-components'
import { Breadcrumbs, Link, Button } from '@material-ui/core';
import sdg4 from '../../static/icons/sdgs/E-WEB-Goal-04.png';
import sdg5 from '../../static/icons/sdgs/E-WEB-Goal-05.png';
import sdg6 from '../../static/icons/sdgs/E-WEB-Goal-06.png';
import sdg7 from '../../static/icons/sdgs/E-WEB-Goal-07.png';
import sdg8 from '../../static/icons/sdgs/E-WEB-Goal-08.png';
import treebg from '../../static/icons/treebg.svg';
import clouds from '../../static/icons/clouds.svg';

import './Tab.css'

const BreadcrumbLink = styled(Link)`
  &.MuiLink-root{
  color: #000;
  }
`;


class Tab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      curTab: 'TRACKER',
    }
    this.onChangeTab = this.onChangeTab.bind(this);
    this.createSdgs = this.createSdgs.bind(this);
  }

  onChangeTab = (tab) => {
    this.setState({curTab:tab})
    this.props.change(tab)
  }

  createSdgs() {
    var array =[];
    this.props.bond.projects.forEach((project)=>{
      array = array.concat(project.sdgs).unique();
    })
    return array;
  }

  render() {
    var curTab = this.state.curTab;
    var bond = this.props.bond;
    var sdgList = this.createSdgs();

      return (
    <div className="Tab">

      <div className="tabDesc">
        <div className="tabDescContent">
          <div className="tabDescContent">
            {bond.projects.length} PROJECTS <i className="tabDescContent-help"> • {bond.bond_type} • SERIES {bond.series} • ISSUED IN {bond.issue_year}</i>
          </div>
          <div className="tabDescContent-desc">{bond.name} {bond.bond_type} Bond</div>
        </div>
        <div className="tabDescImgs">
          {

            sdgList.map((sdg) =>{
               if(sdg <= 9) {
                sdg = "0"+sdg
              }
                       return <img width="52" height="52" className="tabDescImg" src={require(`../../static/icons/sdgs/E-WEB-Goal-${sdg}.png`)} alt='sdg8' />

            })
          }
      
        </div>
      </div>
      <div className="tabWrapper">
        <div className={`tabItem ${curTab === 'TRACKER' && 'active'}`} onClick={() => { this.onChangeTab('TRACKER') }} style={{ marginRight: '29px' }}>
          PROJECT TRACKER
        </div>
        <div className={`tabItem ${curTab === 'IMPACT' && 'active'}`} onClick={() => { this.onChangeTab('IMPACT') }}>
          CLIMATE IMPACT DATA
        </div>
      </div>
    </div >
  );
  }

}

export default Tab;