import React from 'react';
import Swiper from '../components/Swiper/Swiper'
import Filter from '../components/Filter/Filter'
import FilterResult from '../components/FilterResult/FilterResult'
import { filterResults } from './config'

class InvestorPortal extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      bonds:[],
      filteredBonds:[],
      hash :''
    }
    this.fetchBonds = this.fetchBonds.bind(this)
    this.applyFilter = this.applyFilter.bind(this)
  }

  applyFilter(funding, fundingArray, bondType, bondTypeArray, year, yearArray, sdg, sdgsArray) {

     var temp = this.state.bonds.filter(bond => {
        if (sdg == 'all') return true;
        else {
          var result = false;
          sdgsArray.forEach((item)=>{
             if(bond.sdgs.indexOf(item) > -1)
              result = true;

          })
          return result;
        }
        } )
       temp =  temp.filter(bond => {
        if (funding == 'all') return true;
        else {
          return fundingArray.includes(bond.series);
        }
        } )
          temp =  temp.filter(bond => {
        if (bondType == 'all') return true;
        else {
          return bondTypeArray.includes(bond.bond_type);
          
        }
        } )
            temp =  temp.filter(bond => {
              if (year == 'all') return true;
              else {
                return yearArray.includes(bond.issue_year.toString());
              }
              } )
        this.setState({filteredBonds: temp})
  }

  fetchBonds() {
      fetch('http://localhost:8000/api/bond')
    .then(response => response.json())
    .then(data =>
      this.setState({bonds:data, filteredBonds:data})
      )
  }

  componentWillMount() {
    this.fetchBonds();
  }


  render() {
      return (
    <div className="Header">
      <Swiper />
      <Filter changeFilter={this.applyFilter}  />
      {
        filterResults.map((item) => {
          return <FilterResult result={item} bonds={this.state.filteredBonds} />
        })
      }

    </div>);
  }

}


export default InvestorPortal;