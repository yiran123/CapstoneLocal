import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import download from '../../static/icons/download.svg';
import styled from 'styled-components'
import Series from '../Series/Series'




class FilterBond extends React.Component {



  render() {
    const result = this.props.result;
    const bonds = this.props.bonds;

  return (


        <div className="FilterBondBody">
          {
            bonds.filter(bond => bond.enterprise == result.enterprise).map((bond) => {
              return <Series bond={bond} seriesBg={result.seriesBg} />
            })
          }
        </div>

  );
}
}

export default FilterBond;