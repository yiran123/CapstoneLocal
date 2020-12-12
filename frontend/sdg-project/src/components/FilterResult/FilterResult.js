import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import download from '../../static/icons/download.svg';
import styled from 'styled-components'
import Series from '../Series/Series'

import './FilterResult.css'

const StyledButton = styled(Button)`
  color: #1589EE;
  height: 32px;
  &.MuiButton-containedPrimary{
  color: #1589EE;
  height: 32px;
    background-color: rgba(21, 137, 238, 0.1);
    margin-right: 14px;
    &:hover{
    background-color: rgba(21, 137, 238, 0.1);

      }
  }
  
`;


class FilterResult extends React.Component {



  render() {
    const result = this.props.result;
    const bonds = this.props.bonds;

  return (

    <div className="FilterResultWrapper">
      <div className="FilterResultWrapperTop">
        <div className="FilterResultHeader">
          <div className="FilterResultHeaderTop">
            <div className="FilterResultHeaderTitle">
              <img src={this.props.result.titleIcon} style={{ marginRight: '19px' }} alt="water" />
              {result.title}
            </div>

          </div>

        </div>
        <div className="FilterResultBody">
          {
            bonds.filter(bond => bond.enterprise == result.enterprise).map((bond) => {
              return <Series bond={bond} seriesBg={result.seriesBg} />
            })
          }
        </div>
      </div>


    </div>
  );
}
}

export default FilterResult;