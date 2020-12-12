import React from 'react';
import styled from 'styled-components'
import _ from 'lodash'
import './FinancialInformation.css'


// Create our number formatter.
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});


class FinancialInformation extends React.Component {
  constructor(props) {
    super(props);
    
  }

  

  render (){
    var bond = this.props.bond
    var financialInfo = { use_of_proceeds: -1, prior_year_spending: -1, recent_year_spending: -1, maturity_date: '', avg_mature_rate: -1}
    var totalRemaining = -1;
    var remaining = "";
    if(bond.financial_info != undefined 
      && bond.financial_info.use_of_proceeds != undefined
      && bond.financial_info.prior_year_spending != undefined
      && bond.financial_info.recent_year_spending != undefined
      && bond.financial_info.maturity_date != undefined
      && bond.financial_info.avg_mature_rate != undefined
      ) {
      financialInfo = bond.financial_info;
      totalRemaining = parseInt(financialInfo.use_of_proceeds) - parseInt(financialInfo.prior_year_spending) - parseInt(financialInfo.recent_year_spending);
      if(totalRemaining<0) {
        remaining = '('+ formatter.format(-totalRemaining) + ')';
      }
      else {
        remaining = formatter.format(totalRemaining);
      }
    }
    return (
      <div>
        <div className="leftTitle">
        TOTAL USE OF PROCEEDS
          <div style={{
            display: 'inline-block',
            float:'right'
          }}>
            <div className="number"> {formatter.format(financialInfo.use_of_proceeds)} </div>
          </div>
        </div>

        <div className="line"></div>
        <div className="leftTitle">
        TOTAL EXPENDED
          <div style={{
            display: 'inline-block',
            float:'right'
          }}>
            <div className="number">({formatter.format(financialInfo.prior_year_spending + financialInfo.recent_year_spending)})</div>
          </div>
        </div>

        <div className="line"></div>
        <div className="leftTitle">
        TOTAL REMAINING
          <div style={{
            display: 'inline-block',
            float:'right'
          }}>
            <div className="number">{remaining}</div>
          </div>
        </div>

        <div className="line"></div>
        <div className="leftTitle">
        TOTAL FY 18-19 SPENDING
          <div style={{
            display: 'inline-block',
            float:'right'
          }}>
            <div className="number">{formatter.format(financialInfo.recent_year_spending)}</div>
          </div>
        </div>

        <div className="line"></div>
        <div className="leftTitle">
        TOTAL PRIOR YRS SPENDING
          <div style={{
            display: 'inline-block',
            float:'right'
          }}>
            <div className="number">{formatter.format(financialInfo.prior_year_spending)}</div>
          </div>
        </div>

        <div className="line"></div>
        <div className="leftTitle">
        FINAL MATURITY
          <div style={{
            display: 'inline-block',
            float:'right'
          }}>
            <div className="number">{financialInfo.maturity_date}</div>
          </div>
        </div>

        <div className="line"></div>
        <div className="leftTitle">
        COUPON RATE
          <div style={{
            display: 'inline-block',
            float:'right'
          }}>
            <div className="number">{financialInfo.avg_mature_rate*100}%</div>
          </div>
        </div>
        <div className="line"></div>
      </div>
    );
  }
}

export default FinancialInformation;