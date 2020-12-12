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
        textAlign: 'center',
    },
  }))(TableCell);
  
function createData(year, catchment, reduction, reductionTon, status) {
    return { year, catchment, reduction, reductionTon, status };
  }

  function numberWithCommas(x) {
    return parseInt(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }



class FinancialTable extends React.Component {

    constructor(props) {
        super(props)
    }
    
    render() {
        const { classes } = this.props;
        var rows = this.props.data.map((year) => {
            return createData( year.year, year.water_catchment, year.water_reduction, year.water_reduction, year.status);
        });
        var fiscalYear = new Date().getFullYear()-1;
        return (
            <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>YEAR</StyledTableCell>
                  <StyledTableCell align="left">Water Catchment [Tons]</StyledTableCell>
        <StyledTableCell align="left">Water Reduction [%]</StyledTableCell>
                  <StyledTableCell align="left">Water Reduction [Tons]</StyledTableCell>
                  <StyledTableCell align="left">Project Status</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.year}>
                    <StyledTableCell component="th" scope="row">
                      {row.year}
                    </StyledTableCell>
                    
                    <StyledTableCell align="left">{numberWithCommas(row.catchment)}</StyledTableCell>
                    <StyledTableCell align="left">{row.reduction}</StyledTableCell>
                    <StyledTableCell align="left">{numberWithCommas(row.reductionTon)}</StyledTableCell>
                    <StyledTableCell align="left">{row.status}</StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
    }
}
export default withStyles(useStyles)(FinancialTable)