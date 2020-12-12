import React, { useState, useEffect } from 'react';
import Header from './Header'
import sdg3 from '../../static/icons/sdgs/E-WEB-Goal-03.png';
import sdg4 from '../../static/icons/sdgs/E-WEB-Goal-04.png';
import sdg6 from '../../static/icons/sdgs/E-WEB-Goal-06.png';
import sdg7 from '../../static/icons/sdgs/E-WEB-Goal-07.png';
import sdg8 from '../../static/icons/sdgs/E-WEB-Goal-08.png';
import whiteRight from '../../static/icons/whiteRight.svg';
import FinancialTable from './FinancialTable';
import { filterResults } from '../../pages/config';
import FilterResult from '../FilterResult/FilterResult';
import Series from '../Series/Series';
import FilterBond from './FilterBond';
import GhgEmission from './GHGEmission';

import './WaterProject.css'
import ClimateTable from './ClimateTable';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class WaterProject extends React.Component {
	constructor(props) {
    super(props);
    this.state ={
      
      project:{
        
      }
    }
    this.fetchProject = this.fetchProject.bind(this)
	}
	componentWillMount() {
    this.fetchProject();
  }
  fetchProject() {
    fetch(`http://localhost:8000/api/project/${this.props.match.params.id}`)
    .then(response => response.json())
    .then(data =>
      this.setState({project:data})
      )
  }

  getfiscalYear() {
    return new Date().getFullYear()-1;
  }

	render() {
    var self = this;
    var fiscalYear = this.getfiscalYear();
    var climateData = {};
    var climateTableData = [];
    var financialInfo = [];
    var associatedBonds = [];
    var status = "";
    var access = -1;
    var benefit = -1;
    var connection = -1;
    var ghgEmissionData = [];
    if(this.state.project.climate_impact != undefined) {
      climateData = this.state.project.climate_impact;
      financialInfo = this.state.project.financial_info;
      associatedBonds = this.state.project.associated_bonds;
    }  
    if(climateData != undefined) {
      Object.keys(climateData).forEach(e => {
        if(parseInt(e) <= parseInt(fiscalYear)) {
          if(parseInt(e) == parseInt(fiscalYear)) {
            status = climateData[e].status;
            access = climateData[e].people_with_access_to_utilities_count;
            benefit = climateData[e].people_benefiting_count;
            connection = climateData[e].household_connections_count;
          }
          climateTableData.push(climateData[e]);
          ghgEmissionData.push({year:climateData[e].year, baseline: parseInt(climateData[e].ghg_emissions_business_as_usual), actual: parseInt(climateData[e].ghg_emissions_actual_emissions)})
          
        }
        
      })
    }

		return (
			<div>
			<Header project={this.state.project} status = {status}/>
	    <div className="waterInfoContent flex-r">
      <div className="waterInfoContent-left">
        <div>
          
          <div className="waterInfoContent-txt1">FINANCIAL INFORMATION</div>
          <div className="waterInfoContent-left-tab1">
          <FinancialTable data = {financialInfo} />
          </div>
        </div>
        <div>
          <div className="waterInfoContent-txt1">CLIMATE IMPACT DATA</div>
          <div className="waterInfoContent-tab2">
            <div className="waterInfoContent-txt7">MEASURING SOCIAL IMPACT</div>
            <div className="flex-r">
              <div className="flex11 waterInfoContent-tab2-tr">
                <div className="waterInfoContent-txt6">{numberWithCommas(access)}</div>
                <div className="waterInfoContent-txt4">Residents with Equitable and Clean Access to Utilities</div>
                <div className="waterInfoContent-txt5">*Number of People with<br></br> Access to Clean Water</div>
              </div>
              <div className="flex11 waterInfoContent-tab2-tr">
                <div className="waterInfoContent-txt6">{numberWithCommas(benefit)}</div>
                <div className="waterInfoContent-txt4">Residents Benefitting from Climate Mitigation Efforts</div>
              </div>
              <div className="flex11 waterInfoContent-tab2-tr">
                <div className="waterInfoContent-txt6">{numberWithCommas(connection)}</div>
                <div className="waterInfoContent-txt4">New Household  Connections</div>
                <div className="waterInfoContent-txt52">*Number of New Household<br></br> Water Connections</div>
              </div>
            </div>
          </div>
        </div>
        <div className="waterInfoContent-tab3">
          <div className="flex-r">
            <div className="waterInfoContent-tab3-txt1">ANNUAL GHG EMISSIONS</div>
            <div className="waterInfoContent-tab3-txt2 waterInfoContent-tab3-bg1 line30">Percent Reduction [%]</div>
            <div className="waterInfoContent-tab3-txt2 waterInfoContent-tab3-bg2 line30">Raw Amount [kg]</div>
          </div>
          <div className="flex-rz">
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
          </div>
          
          <div className="waterInfoContent-tab3-bar" id="water-info-bar-chart">
          <GhgEmission data={ghgEmissionData} />
          </div>
        </div>
        <div className="waterInfoContent-tab5">
          <ClimateTable data={climateTableData} />
          
        </div>
      </div>
      <div className="waterInfoContent-right">
        <div className="waterInfoContent-txt12">ASSOCIATED BONDS</div>
      <div className="filterBondBody">
      {
        filterResults.map((item) => {
          return <FilterBond result={item} bonds={associatedBonds} />
        })
      }
      </div>                     
      </div>
    </div>
	    	</div>
		)
	}
}
export default WaterProject;