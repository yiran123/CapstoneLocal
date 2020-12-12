import React from 'react';
import styled from 'styled-components'
import { lighten, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { unsdgs } from '../Filter/const'



 function createData (name, useOfProceeds, currentSpending, priorSpending, totalExpended, unSdgs, projectId) {
    return { name, useOfProceeds, currentSpending, priorSpending, totalExpended, unSdgs, projectId };
  }


const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'PROJECT NAME' },
  { id: 'useOfProceeds', numeric: true, disablePadding: false, label: 'USE OF PROCEEDS' },
  { id: 'spending', numeric: true, disablePadding: false, label: 'FY 18-19 SPENDING' },
  { id: 'priorSpends', numeric: true, disablePadding: false, label: 'PRIOR SPENDING' },
  { id: 'totalExpended', numeric: true, disablePadding: false, label: 'TOTAL EXPENDED' },
  { id: 'unSdgs', numeric: true, disablePadding: false, label: 'UN SDGs' },
];



const StyledTableCell = withStyles((theme) => ({
  head: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '16px',
    textAlign: 'left'
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = theme => ({
  root: {
    width: '100%',

  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    
  },
  table: {
    minWidth: 750,
  },
  tableRow: {
    cursor: 'pointer',
  },


});

const NameWrapper = styled.div`
font-style: normal;
font-weight: 500;
font-size: 17px;
line-height: 20px;
color: #425206;
width: 300px;
`

const SpendingWrapper = styled.div`
width: 145.2px;
text-align: left;
font-size: 17px;
line-height: 20px;
font-style: normal;
font-weight: 300;
line-height: 20px;
display: flex;
align-items: center;
color: #080707;
`

const UseOfProceedsWrapper = styled.div`
width: 145.2px;
font-style: normal;
font-weight: 300;
font-size: 17px;
line-height: 20px;
color: #080707;
text-align: left;
color: #080707;
`

function getUdSdgs (arr) {
  if (!arr) return null
  return <>
    {arr.map(sdg => {
      return <img width="36" height="36" style={{ marginRight: '6px' }} src={unsdgs[sdg]} alt='sdg' />
    })}
  </>
}

const PriorSpendsWrapper = styled.div`
font-style: normal;
font-weight: 300;
font-size: 17px;
line-height: 20px;
color: #080707;
width: 139.2px;
`

const TotalExpendedWrapper = styled.div`
font-style: normal;
font-weight: 300;
font-size: 17px;
line-height: 20px;
color: #080707;
width: 139.2px;
`

// Create our number formatter.
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});



class EnhancedTable extends React.Component {

  constructor(props) {
    super(props);
    this.state ={

      dense: false,
      hash: ''
    }
    this.handleClick = this.handleClick.bind(this);
    
  }

  handleClick = (event, id) => {
    this.setState({hash : `/project/${id}`})
    window.location.href = `${window.location.origin}/project/${id}`
  };





 
  render() {
    const { classes } = this.props;

    var dense = this.state.dense;
    var rows = this.props.projects.map((project) => {
        return createData( project.name, 
        project.use_of_proceeds, project.recent_year_spending , project.prior_spending, project.prior_spending + project.recent_year_spending, project.sdgs, project.id );
    });

     return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size={dense ? 'small' : 'medium'}
          aria-label="enhanced table"
        >
    <TableHead>
      <TableRow >

        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
           
          >
              {headCell.label}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
          <TableBody
           
          >
            {
              rows.map((row, index) => {


                return (
                  <TableRow className={classes.tableRow}
                    hover
                    onClick={(event) => this.handleClick(event, row.projectId)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.projectId}
                  >

                    <TableCell component="th" id={row.projectId} scope="row">
                      <NameWrapper>{row.name}</NameWrapper>
                    </TableCell>

                    <TableCell align="left">
                      <UseOfProceedsWrapper>
                      {formatter.format(row.useOfProceeds)}
                      </UseOfProceedsWrapper>
                    </TableCell>
                    <TableCell align="left">
                      <SpendingWrapper>
                      {formatter.format(row.currentSpending)}
                      </SpendingWrapper>
                    </TableCell>
                    <TableCell align="left">
                    <PriorSpendsWrapper>
                    {formatter.format(row.priorSpending)}
                    </PriorSpendsWrapper>
                    </TableCell>
                    <TableCell align="left">
                      <TotalExpendedWrapper>
                      {formatter.format(row.totalExpended)}
                      </TotalExpendedWrapper>
                    </TableCell>
                    <TableCell align="left">
                      {getUdSdgs(row.unSdgs)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

      </Paper>
    </div>
  );
  }
 
}
export default withStyles(useStyles)(EnhancedTable)
