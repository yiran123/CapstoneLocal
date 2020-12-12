import React, { useState, useEffect } from 'react';
import Tab from '../Tab/Tab'
import Table from './Table'
import DetailContentBottom from './DetailContentBottom'
import SdgsAlignment from './SdgsAlignment'
import FinancialInformation from './FinancialInformation';
import AnnualWaterReduction from './AnnualWaterReduction';
import GHGEmissionBond from './GHGEmissionBond.js';



import './DetailContent.css'


function getfiscalYear() {
  return new Date().getFullYear()-1;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}




class DetailContent extends React.Component {

    constructor(props) {
    super(props);
    this.state ={
      curTab: 'TRACKER',
      bond:{
        projects:[]
      },
      filterProjects:[]
      
    }
    this.fetchBond = this.fetchBond.bind(this)
    this.onChangeTab = this.onChangeTab.bind(this)
    this.getProjectStatus = this.getProjectStatus.bind(this)
    this.getPreStatus = this.getPreStatus.bind(this)
    this.applyFilter = this.applyFilter.bind(this)
  }
  
  componentDidUpdate() {

  }

  componentWillMount() {
    this.fetchBond();
  }

  onChangeTab(e) {
    if(e != 'TRACKER') {
      this.setState({      filterProjects:this.state.bond.projects     })
    }
    this.setState({curTab: e})
  }

  getCounts(climateData) {
    var access = 0;
    var connection = 0;
    var benefit = 0;
    climateData.forEach(e => {
      if(e.year == getfiscalYear()) {
        access += e.people_with_access_to_utilities_count;
        connection += e.household_connections_count;
        benefit += e.people_benefiting_count;
  
      }
    })
    return [access, connection, benefit];
  }

  getPreStatus(climateData) {
    var prefiscalYear = new Date().getFullYear()-2;
    var not = 0;
    var un = 0;
    var up = 0;
    var bu = 0;
    climateData.forEach(e => {
    if(e.year === prefiscalYear) {
      if(e.status == 'Not Started') {
        not++;

      }
      if (e.status == 'Under Construction') {
        un++;

      }
      if (e.status == 'Upgraded') {
        up++;

      }
      if (e.status == 'Built') {
        bu++;

      }
    }})

    return [not, un, up, bu]
  }
  getProjectStatus(climateData) {
    var fiscalYear = new Date().getFullYear()-1;
    var not = 0;
    var un = 0;
    var up = 0;
    var bu = 0;
    climateData.forEach(e => {
    if(e.year === fiscalYear) {
      if(e.status == 'Not Started') {
        not++;

      }
      if (e.status == 'Under Construction') {
        un++;

      }
      if (e.status == 'Upgraded') {
        up++;

      }
      if (e.status == 'Built') {
        bu++;

      }
    }})

    return [not, un, up, bu]
  }

  getAllYear(climateData) {
    var fiscalYear = this.getfiscalYear();
    var year = [];
    climateData.forEach(e => {
      if(parseInt(e.year)<=parseInt(fiscalYear)) {
        if(!year.includes(e.year)) {
          year.push(e.year);
        }
      }
    })
    return year;
  }

  getReduction(climateData) {
    var fiscalYear = getfiscalYear();
    var data = {}
    climateData.forEach(e => {
      if(parseInt(e.year)<=parseInt(fiscalYear)) {
        if(data[e.year] === undefined) {
          data[e.year] = parseInt(e.water_reduction);
        }
        else {
          data[e.year] += parseInt(e.water_reduction);
        }
      }
    })
    return data;
  }

  getGHGEmissionData(climateData) {
    var fiscalYear = getfiscalYear();
    var data = []
    climateData.forEach(e => {
      if(parseInt(e.year)<=parseInt(fiscalYear)) {
        var index = this.findWithAttr(data, 'year', e.year);
        if(index == -1) {
          data.push( {year: e.year, baseline: parseInt(e.ghg_emissions_business_as_usual), actual: parseInt(e.ghg_emissions_actual_emissions)});
        }
        else {
          data[index].baseline += parseInt(e.ghg_emissions_business_as_usual);
          data[index].actual += parseInt(e.ghg_emissions_actual_emissions);
        }
      }
    });
    return data;
  }

  findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}


  applyFilter(sdg, sdgsArray) {
    if(sdg == 'part') {
      var temp = this.state.bond.projects.filter(
         e=>  {return e.sdgs.includes(sdgsArray.value)
        });
      this.setState({filterProjects: temp})
    }
    else {
      this.setState({filterProjects: this.state.bond.projects})
    }
  }

  

  

  fetchBond()   {
    fetch(`http://localhost:8000/api/bond/${this.props.match.params.id}`)
    .then(response => response.json())
    .then(data =>
      this.setState({bond:data,filterProjects:data.projects})
      )
  }

  render() {
    var curTab = this.state.curTab;
    var climateData = [];
    var status = [];
    var preStatus = [];
    var counts = [];
    var access = -1;
    var connection = -1;
    var benefit = -1;
    var bondType = "WATER REDUCTION";
    var bondUnit = "Tons";
    var reductionData = {};
    var self = this;
    var ghgData = {};
    if(this.state.bond.climate_impact != undefined) {
      climateData = this.state.bond.climate_impact
    }  
    var fiscalYear = getfiscalYear();
    if(climateData != undefined && climateData.length >   0) {
      status = this.getProjectStatus(climateData);
      preStatus = this.getPreStatus(climateData);
      counts = this.getCounts(climateData);
      reductionData = this.getReduction(climateData);
      ghgData = this.getGHGEmissionData(climateData);
    }

    if(this.state.bond.enterprise != undefined) {
      switch(this.state.bond.enterprise) {
        case "Power":
          bondType = "ENERGY SAVINGS";
          bondUnit = "Joules"
          break;
          case "Wastewater":
            bondType = "WATER TREATED, REUSED, AND AVOIDED";
            bondUnit = "Joules"
            break;
      }
    }  
    access = counts[0];
    connection = counts[1];
    benefit = counts[2];
    var diff = [status[0]-preStatus[0],status[1]-preStatus[1],status[2]-preStatus[2],status[3]-preStatus[3]]
      return (
    <div className="DetailContent">
      <Tab change={this.onChangeTab} bond={this.state.bond} />
      {
        curTab === 'TRACKER' && <div>
          <div className="DetailContentProject">  
            <div className="DetailContentProjectInner">
              <div className="DetailContentProjectCard" style={{ margin: '0 31px' }}>
                <div className="DetailContentProjectCardTop">
                  <div className="title">SDG Alignment</div>
                  <div >
                    <span className="desc">
                      Amount [$]
                </span>
                  </div>
                </div>
                <div className="DetailContentProjectCardBottom">
                  <SdgsAlignment changeFilter={this.applyFilter} projects={this.state.bond.projects}/>
                </div>

              </div>
              <div className="DetailContentProjectCard" style={{ margin: '0 31px' }}>
                <div className="DetailContentProjectCardTop">
                  <div className="title">FINANCIAL INFORMATION</div>

                </div>
                <div className="DetailContentProjectCardBottom">
                  <FinancialInformation bond={this.state.bond}/>
                </div>

              </div>

            </div>
            <p className="cardName">
              VIEWING : ALL PROJECTS
        </p>
          </div>
          <Table projects={this.state.filterProjects} />
          <DetailContentBottom bond={this.state.bond}/>
        </div>
      }
      {

          curTab === 'IMPACT' &&
          <div>
            <div className="impactTop">
              <div className="text-area">
                <div className="text">Track the climate impacts of projects funded by this specific bond. All metrics are those recommended by the ICMA<br></br>
                Harmonized Framework for Green Bond Impact Reporting. Some metrics are only tracked exclusively for certain enterprises.<br></br>
                In some instances, issuers may not be able to disclose all information related to all metrics due to internal limitations. </div>
              </div>

              </div>
            <div className="impactBottom">
              <div className="impactChart">
              <div className="wrapper-info">
                
      <div className="wrapper-impact">
        <div className="wrapper-impact-txt1">MEASURING SOCIAL IMPACT</div>
        <div className="wrapper-impact-txt2">Track the climate impacts of projects funded by this specific bond. All metrics are those<br></br>
         recommended by the ICMA Harmonized Framework for Green Bond Impact Reporting. </div>
        <div className="wrapper-impact-data">
          <div className="wrapper-impact-data-info">
      <div className="wrapper-impact-data-txt1">{numberWithCommas(access)}</div>
            <div className="wrapper-impact-data-txt2">Residents with Equitable and Clean Access to Utilities</div>
            <div className="wrapper-impact-data-txt3">*Number of People with Access to Clean Water</div>
          </div>
          <div className="wrapper-impact-data-info">
      <div className="wrapper-impact-data-txt1">{numberWithCommas(benefit)}</div>
            <div className="wrapper-impact-data-txt2">SF Residents Benefitting from Climate Mitigation Efforts</div>
          </div>
          <div className="wrapper-impact-data-info">
            <div className="wrapper-impact-data-txt1">{numberWithCommas(connection)}</div>
            <div className="wrapper-impact-data-txt2">New Household  Connections</div>
            <div className="wrapper-impact-data-txt3">*Number of New Household Water Connections</div>
          </div>
        </div>
      </div>
      <div className="wrapper-char">
        <div className="wrapper-char-left">
          <div className="wrapper-char-left-txt1">
            ANNUAL {bondType}
          </div>
          <div className="flex space-bet">
            <div className="wrapper-char-left-txt2">
              Amount in {bondUnit}
            </div>
          </div>
          <div className="wrapper-char-bar" id="water-page-line-chart">
            <AnnualWaterReduction data={reductionData}  />
            </div>
        </div>
        <div className="wrapper-char-right">
          <div className="flex space-bet">
            <div className="wrapper-char-right-txt1">PROJECT STATUS</div>
      <div className="wrapper-char-right-txt2">As of June 30, {fiscalYear}</div>
          </div>
          <div className="flex space-bet">
            <div className="wrapper-char-right-case">
              <div className="flex">
                <div className="wrapper-char-right-button background1">
      <span className="wrapper-char-right-txt5">{status[0]}</span>
                  <span className={`triangle-${diff[0] < 0 ? 'down' : 'up'}`}></span>
      <span className="wrapper-char-right-txt6">{status[0]-preStatus[0]}</span>
                </div>
                <div className="wrapper-char-right-txt4">Not Started</div>
              </div>
              <div className="flex">
                <div className="wrapper-char-right-button background2">
                  <span className="wrapper-char-right-txt5">{status[1]}</span>
                  <span className={`triangle-${diff[0] < 0 ? 'down' : 'up'}`}></span>
                  <span className="wrapper-char-right-txt6">{status[1]-preStatus[1]}</span>
                </div>
                <div className="wrapper-char-right-txt4">Under Construction</div>
              </div>
              <div className="flex">
                <div className="wrapper-char-right-button background3">
                  <span className="wrapper-char-right-txt5">{status[2]}</span>
                  <span className={`triangle-${diff[0] < 0 ? 'down' : 'up'}`}></span>
                  <span className="wrapper-char-right-txt6">{status[2]-preStatus[2]}</span>
                </div>
                <div className="wrapper-char-right-txt4">Upgraded</div>
              </div>
              <div className="flex">
                <div className="wrapper-char-right-button background4">
                  <span className="wrapper-char-right-txt5">{status[3]}</span>
                  <span className={`triangle-${diff[0] < 0 ? 'down' : 'up'}`}></span>
                  <span className="wrapper-char-right-txt6">{status[3]-preStatus[3]}</span>
                </div>
                <div className="wrapper-char-right-txt4">Built</div>
              </div>
            </div>
            <div className="wrapper-char-right-txt3">
              The goal is to <span>prioritize low-carbon alternatives</span> of important community investments. Establishing a conventional project to compare against mitigation alternatives is critical for quantifying greenhouse gas reductions.
            </div>
          </div>
        </div>
      </div>
      <div className="wrapper-news">
        <div className="wrapper-news-left">
          <div className="wrapper-news-left-txt1">ANNUAL GHG EMISSIONS</div>
          <div className="wrapper-news-left-txt2">The goal is to <span>prioritize low-carbon alternatives</span> of <br></br>important community investments. Establishing a<br></br> conventional project to compare against mitigation<br></br>  alternatives is critical for quantifying greenhouse gas<br></br> reductions. 
          <span>Wedge</span> is the difference between emissions<br></br> for conventional investment choices and emissions<br></br> from actual investments selected for financing in CIP.
          </div>
        </div>
        <div className="wrapper-news-right" id="water-page-bar-char">
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="waterInfoContent-tab3-demo">
              <div className="flex-r">
                <div className="waterInfoContent-tab3-bg3"></div>
                <div className="waterInfoContent-tab3-txt2 line20">Baseline</div>
              </div>
              <div className="flex-r">
                <div className="waterInfoContent-tab3-bg4"></div>
                <div className="waterInfoContent-tab3-txt2 line20">Actual</div>
              </div>
            </div>
            <div className="waterInfoContent-tab3-txt2 waterInfoContent-tab3-bg2 line30">Raw Amount [kg]</div>
            
          </div>
          <div style={{marginTop:'25px'}}>
          <GHGEmissionBond  data={ghgData} />
          </div>
        </div>
      </div>
    </div>
              </div>
            </div>
          </div>
        }
      </div >
    );
  }


}

export default DetailContent;