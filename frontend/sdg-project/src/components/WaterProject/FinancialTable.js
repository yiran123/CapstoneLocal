import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';





const useStyles = theme => ({
    root: {
      width: '100%',
  
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
      
    },
    table: {
      width: 700,
      background: '#FFFFFF',
      boxShadow: '0px 0px 16px 4px rgba(12, 43, 66, 0.15)',
    },
  });

  const StyledTableRow = withStyles((theme) => ({
    root: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 16,
      /* identical to box height */
      letterSpacing: '0.04em',
      color: '#0C2B42',
    },
  }))(TableRow);

  const StyledTableCell = withStyles((theme) => ({
    head: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: 14,
        letterSpacing: '0.04em',
        color: '#0C2B42',
    },
    body: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 300,
        fontSize: 16,
        color: '#51687B',
    },
  }))(TableCell);
  
function createData(bondName, uop, recentSpending, priorSpending, totalSpending) {
    return { bondName, uop, recentSpending, priorSpending, totalSpending };
  }

// Create our number formatter.
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});



class FinancialTable extends React.Component {

    constructor(props) {
        super(props)
    }
    
    render() {
        const { classes } = this.props;
        var rows = this.props.data.map((bond) => {
            return createData( bond.bond, bond.use_of_proceeds, bond.recent_year_spending, bond.prior_year_spending, parseInt(bond.prior_year_spending)+parseInt(bond.recent_year_spending));
        });
        var fiscalYear = new Date().getFullYear()-1;
        return (
            <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>BOND NAME</StyledTableCell>
                  <StyledTableCell align="left">UOP</StyledTableCell>
        <StyledTableCell align="left">FY {fiscalYear-1}-{fiscalYear} SPENT</StyledTableCell>
                  <StyledTableCell align="left">PRIOR SPENT</StyledTableCell>
                  <StyledTableCell align="left">TOTAL SPENT</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.bondName}>
                    <StyledTableCell component="th" scope="row">
                      {row.bondName}
                    </StyledTableCell>
                    
                    <StyledTableCell align="left">{formatter.format(row.uop)}</StyledTableCell>
                    <StyledTableCell align="left">{formatter.format(row.recentSpending)}</StyledTableCell>
                    <StyledTableCell align="left">{formatter.format(row.priorSpending)}</StyledTableCell>
                    <StyledTableCell align="left">{formatter.format(row.totalSpending)}</StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
    }
}
export default withStyles(useStyles)(FinancialTable)