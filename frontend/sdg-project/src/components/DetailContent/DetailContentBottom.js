import React, { useState, useEffect } from 'react';
import LocalContractors from './LocalContractors'

import './DetailContentBottom.css'


class DetailContentBottom extends React.Component {
  constructor(props) {
    super(props);
  }


  render () {
    var bond = this.props.bond;
    var contractors = {};
    var contractorData = [];
    var topContractor = [];
    var data = [];
    if (bond != undefined && bond.constractors != undefined) {
      contractors = bond.constractors
    }
    Object.keys(contractors).forEach(e => {
      if(contractors[e].uop != 0) {
        contractorData.push({name: e, value:contractors[e].uop, description: contractors[e].description});
      }     
    })

    contractorData.sort(function(a, b) {return b.value-a.value});
    contractorData.forEach(e => {
      data.push({name: e.name, value:e.value});
      if(contractorData.indexOf(e)<2) {
        topContractor.push({name: e.name, description: e.description})
      }
    })
      
    return (
      <div className="DetailContentBottom">
        <div className="card">
          <div className="LocalTitle">
            <p className="LocalTitleText">Local Contractors</p>
            <p className="LocalTitleText2">Top Project Contractors</p>
          </div>
          <p className="LocalHelp">Share of Use of Proceeds</p>         
          <div className="LocalCharts">
            <div style={{width: 541, marginTop:'20px' }}>
              <span className="desc">
                Amount [$]
              </span>
              <LocalContractors data={data}  />
            </div>
            <div className="LocalContractor">
              <div className="ContractorCard">
                <div style={{padding:15}}>
                  <div className="ContractorTitle">
                    {topContractor.length>0 ? topContractor[0].name : ""}
                  </div>
                  <p className="ConDesc" style={{padding:'16px 0 0 5px'}}>Description</p>
                  <div className="ContractorDesc"style={{padding:'0 0 0 5px'}}>
                    {topContractor.length>0 ? topContractor[0].description : ""}
                  </div>
                </div>
              </div>  
              <div className="ContractorCard">
                <div style={{padding:15}}>
                  <div className="ContractorTitle">
                    {topContractor.length>1 ? topContractor[1].name : ""}
                  </div>
                  <p className="ConDesc" style={{padding:'16px 0 0 5px'}}>Description</p>
                  <div className="ContractorDesc"style={{padding:'0 0 0 5px'}}>
                    {topContractor.length>1 ? topContractor[1].description : ""}
                  </div>
                </div>
              </div>
            </div>          
          </div>
        </div>
      </div >
    );
  }
}

export default DetailContentBottom;