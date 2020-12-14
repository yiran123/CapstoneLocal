import React, { useState } from 'react';

import right from '../../static/icons/seriesRight.svg';


import './Series.css'

// Create our number formatter.
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

class Series extends React.Component  {
  constructor(props) {
    super(props);
    this.state ={
      hash :'',
    }
    this.goOtherPage = this.goOtherPage.bind(this)

  }

  goOtherPage() {
    this.setState({hash : `/bond/${this.props.bond.id}`})
    window.location.href = `${window.location.origin}/bond/${this.props.bond.id}`
  }

  componentDidMount() {
     if (window.location.hash === '/bond') {
      this.setState({hash:window.location.hash})
    }
  }

render() {
  const seriesBg = this.props.seriesBg;
  const bond = this.props.bond;
  const self = this;
  return (
    <div className="seriesWrapper" style={{ 'backgroundColor': seriesBg }}>
      <div className="seriesTitle">{`Series ${bond.issue_year}${bond.series}`}
      <img onClick={()=>self.goOtherPage()} src={right} alt="right" style={{ marginLeft: '20px', cursor: 'pointer' }} />
      </div>
      <div className="series-refunding-bond">
        {bond.bond_type} Bond  •  {bond.issue_year}
    </div>

      <div className="series-bond-rating">
        <div className="SP">S&P <span class="bondRating">Bond rating</span></div>
        <div>AAA</div>
      </div>
      <div className="series-projects">
        <div style={{
          fontSize: '16px',
          lineHeight: '22px',
          fontFamily: 'Roboto',
          fontWeight: '300',
          lineHeight: '24px',
          letterSpacing: '1px'
        }}>{bond.project_counts} projects</div>
        <div style={{
          fontSize: '16px',
          fontFamily: 'Roboto',
          fontWeight: '500',
          lineHeight: '22px',
          color: '#092A47',
          paddingTop: '5px'
        }}>CUSIP: {bond.CUSIP}</div>
      </div>

      <div className="series-line"></div>

      <div className="series-uop">
        Use of Proceeds  
        <div style={{
          display: 'inline-block',
          float:'right'
        }}>     
        {formatter.format(bond.use_of_proceeds)}
        </div>
    </div>

      <div className="series-coupon-rate">
        Coupon Rate       
        <div style={{
          display: 'inline-block',
          float:'right'
        }}>
          {(bond.avg_mature_rate*100).toFixed(2)}%
        </div>
    </div>
     <div className="series-maturity-year">
        Maturity Year
        <div style={{
          display: 'inline-block',
          float:'right'
        }}>
          {bond.maturity_year}
          </div>
      </div>

      <div style={{marginTop: 20 }}>
        <div className="series-UN-SDGs-title">TOP UN SDGs</div>
        <div className="series-UN-SDGs">
          {
            bond.sdgs.map((sdg)=>{
              if(sdg <= 9) {
                sdg = "0"+sdg
              }

              return <img src={require(`../../static/icons/sdgs/E-WEB-Goal-${sdg}.png`)} width="52" height="54" alt={sdg} />

            })
          }

        </div>
      </div>
    </div>
  );
}
}

export default Series;