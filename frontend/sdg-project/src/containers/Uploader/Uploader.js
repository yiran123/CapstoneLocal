import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';
import * as XLSX from 'xlsx';
import * as papa from 'papaparse';
import axios from 'axios';
import rush from '../../static/icons/rush-11.png';
import firstPage from '../../static/icons/first_page.svg';
import uploadImg from '../../static/icons/upload.png';
import { Button, Input } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress'

import './Uploader.css'

const StyledButton = withStyles({
  root: {
    background: '#F4F6F9',
    borderRadius: 3,
    border: '1px solid #728A12',
    height: 42,
    width: 241,
    
    
    '&:hover': {
        boxShadow: '0px 0px 3px #0070D2',
        borderRadius: '4px',
      },
    // display: 'flex',
    // flexDirection: 'row',
    // alignItems: 'center',
    padding: '1px 16px',

  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);

class Uploader extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            mainState: "initial",
            file: '',
            errors: [],
            selectedFile: null,
            loading: false
        }
    };

    onChangeHandler = (e) => {
        if (e.target.files === undefined 
            || e.target.files.length == 0
            || e.target.files[0].name === undefined
            || e.target.files[0].name.split(',').length == 0) {
                
            return;
        }

        if (e.target.files[0].name.split('.').pop().toLowerCase() != 'xlsx') {
            this.setState({
                errors: [
                    ...this.state.errors,
                    'The file should have extension of "xlsx"'
                ]
            });
        } else {
            this.setState({
                file: e.target.files[0],
                mainState: "uploaded",
                selectedFile: e.target.files[0].name,
            });
        }
    }

    parseContractors = (worksheet, sheetName) => {
        const properties = ['Contractor Name', 'Contractor Description'];

        const csvString = XLSX.utils.sheet_to_csv(worksheet, {header: 1});
        const json = papa.parse(csvString, {header: true});

        // filter empty cell.
        const newJson = this.deleteEmptyCells(json.data);
        
        console.log('123123123123');
        for (let item of newJson) {
            const errors = [];
                properties.forEach(property => {
                    this.checkPropertyExistence(item, property, sheetName, errors);
                });
                if (errors.length > 0) {
                    this.setState({
                        errors: [
                            ...this.state.errors,
                            ...errors
                        ]
                    });
                    return;
                }
    
                delete item[''];
                delete item['Instructions'];
    
                item['name'] = item['Contractor Name'];
                item['description'] = item['Contractor Description'];
    
                delete item['Contractor Name'];
                delete item['Contractor Description'];
        }

        return newJson;
    }

    /**
     * Delete empty cells.
     * Helper method.
     * 
     * @param {JsonArray} jsonArray json array
     */
    deleteEmptyCells = (jsonArray) => {
        return jsonArray.filter(item => {
            for (let key in item) {
                if (item[key].trim() != '') {
                    return true;
                }
            }
            return false;
        });
    }

    checkPropertyExistence = (item, property, sheetName, errors) => {
        if (!item.hasOwnProperty(property)) {
            errors.push('Sheet: \'' + sheetName + '\' has no column: \'' + property + '\'');
        }
    }

    /**
     * Parse project information.
     * 
     * @param {worksheet} worksheet "Project Information" worksheet.
     * @returns Json array of all project information.
     */
    parseProjects = (worksheet, sheetName) => {
        const properties = ['Project Name', 'Project Number', 'Project Description', 'Contractor', 'SDG Alignment #1', 'SDG Alignment #2'];

        const csvString = XLSX.utils.sheet_to_csv(worksheet, {header: 1});
        const json = papa.parse(csvString, {header: true});

        // filter empty cell.
        const newJson = this.deleteEmptyCells(json.data);

        // Change key name.
        for (let item of newJson) {
            // Check if all properties exist.
            const errors = [];
            properties.forEach(property => {
                this.checkPropertyExistence(item, property, sheetName, errors);
            });
            if (errors.length > 0) {
                this.setState({
                    errors: [
                        ...this.state.errors,
                        ...errors
                    ],
                    loading: false
                });
                return;
            }

            // change key name.
            delete item['Instructions'];
            delete item[''];
            delete item['Project Name and Number'];
            delete item['Enterprise'];

            item['name'] = item['Project Name'];
            item['project_number'] = item['Project Number'];
            item['description'] = item['Project Description']
            item['sdg1'] = item['SDG Alignment #1']
            item['sdg2'] = item['SDG Alignment #2']

            delete item['Project Name'];
            delete item['Project Number'];
            delete item['Project Description'];
            delete item['SDG Alignment #1'];
            delete item['SDG Alignment #2'];
        }

        return newJson;
    }

    parseBonds = (worksheet, sheetName) => {
        const properties = ['Issue Year', 'Series', 'Enterprise', 'Bond Type', 'Bond Name', 
            'CUSIP', 'Green Bond Verifier (If Applicable)', 'Coupon Rate', 'Final Maturity Date']

        const csvString = XLSX.utils.sheet_to_csv(worksheet, {header: 1});

        const json = papa.parse(csvString, {header: true});
        const newJson = this.deleteEmptyCells(json.data);

        // Change key name.
        for (let item of newJson) {
            const errors = [];
            properties.forEach(property => {
                this.checkPropertyExistence(item, property, sheetName, errors);
            });
            if (errors.length > 0) {
                this.setState({
                    errors: [
                        ...this.state.errors,
                        ...errors
                    ]
                });
                return;
            }

            delete item['Instructions'];
            delete item[''];

            item['name'] = item['Bond Name'];
            item['enterprise'] = item['Enterprise'];
            item['avg_mature_rate'] = parseFloat(item['Coupon Rate']) / 100.0;
            item['bond_type'] = item['Bond Type'];
            item['issue_year'] = parseInt(item['Issue Year']);
            item['series'] = item['Series'];
            item['verifier'] = item['Green Bond Verifier (If Applicable)'];
            item['maturity_date'] = item['Final Maturity Date'];

            delete item['Bond Name'];
            delete item['Enterprise'];
            delete item['Coupon Rate'];
            delete item['Bond Type'];
            delete item['Issue Year'];
            delete item['Series'];
            delete item['Green Bond Verifier (If Applicable)'];
            delete item['Final Maturity Date'];
        }
        console.log('99999999 bond');
        console.log(newJson);
        return newJson;
    }

    parseFinancialInfo = (worksheets) => {
        const GAP = 7;
        const BOND_INITIAL_COL = 3;
        const PROJECT_INITIAL_COL = 2;

        const financialInfo = []

        for (let worksheet of worksheets) {
            const csvString = XLSX.utils.sheet_to_csv(worksheet);
            const parsedData = papa.parse(csvString);

            for (let j = BOND_INITIAL_COL; j < parsedData.data[0].length; j += GAP) {
                if (parsedData.data[0][j] === undefined
                || parsedData.data[0][j].toString().trim() == '') {
                    continue;
                }
    
                let bond_name = parsedData.data[0][j];
                financialInfo.push({
                    bond: bond_name,
                    projects: []
                });
            }
    
            const number_error = 'Financial data should be decimal!';
            for (let j = PROJECT_INITIAL_COL, counter = 0; counter < financialInfo.length; j += GAP, counter++) {
                for (let i = 2; i < parsedData.data.length; i++) {
                    
                    if (parsedData.data[i][j] === undefined
                    || parsedData.data[i][j + 1] === undefined
                    || parsedData.data[i][j + 2] === undefined
                    || parsedData.data[i][j + 3] === undefined
                    || parsedData.data[i][j].toString().trim() == ''
                    || parsedData.data[i][j + 1].toString().trim() == ''
                    || parsedData.data[i][j + 2].toString().trim() == ''
                    || parsedData.data[i][j + 3].toString().trim() == '') {
                        
                        continue;
                    }
    
                    let project, use_of_proceeds, prior_year_spending, recent_year_spending;
                    try {
                        project = parsedData.data[i][j].toString();
                        use_of_proceeds = parseFloat(parsedData.data[i][j + 1].toString().substring(1).replace(/,/g, ''));
                        prior_year_spending = parseFloat(parsedData.data[i][j + 2].toString().substring(1).replace(/,/g, ''));
                        recent_year_spending = parseFloat(parsedData.data[i][j + 3].toString().substring(1).replace(/,/g, ''));
                    } catch (err) {
                        this.setState({
                            errors: [
                                ...this.state.errors,
                                number_error
                            ]
                        });
                        return; 
                    }
                    
                    financialInfo[counter].projects.push({
                        project: project,
                        use_of_proceeds: use_of_proceeds,
                        prior_year_spending: prior_year_spending,
                        recent_year_spending: recent_year_spending
                    });
                }
            }
        }
        return financialInfo;
    }

    parseTimeSeries = (worksheets) => {
        const PROJECT_INITIAL_COL = 3, GAP = 12;

        const timeSeries = [];
        for (let worksheet of worksheets) {
            const csvString = XLSX.utils.sheet_to_csv(worksheet);
            const parsedData = papa.parse(csvString);

            let j = PROJECT_INITIAL_COL;
            while (true) {
                if (parsedData.data[0][j] === undefined
                || parsedData.data[0][j].toString().trim() == '') {
                    break;
                }

                if (parsedData.data.length == 0) {
                    break;
                }

                let k = j;
                while (true) {
                    if (parsedData.data[1][k] === undefined
                    || parsedData.data[1][k].toString().trim() == '') {
                        break;
                    }

                    //TODO: parseInt
                    timeSeries.push({
                        project: parsedData.data[0][j],
                        year: parseInt(parsedData.data[1][k]),
                        status: parsedData.data[2][k],
                        
                        household_connections_count: parseInt(parsedData.data[3][k]),
                        people_with_access_to_utilities_count: parseInt(parsedData.data[4][k]),
                        people_benefiting_count: parseInt(parsedData.data[5][k]),

                        ghg_emissions_business_as_usual: parseFloat(parsedData.data[7][k]),
                        ghg_emissions_actual_emissions: parseFloat(parsedData.data[8][k]),

                        water_reduction: parseFloat(parsedData.data[15][k]),
                        water_catchment: parseFloat(parsedData.data[16][k])
                    })

                    k++;
                }
                j = k + 2;
            }
        }
        return timeSeries;
    }

    checkSheetExistence = (sheet, sheetName) => {
        const newError = 'The sheet \' ' + sheetName + ' \' doesn\'t exist!';
        if (sheet === undefined) {
            this.setState({
                errors: [
                    ...this.state.errors,
                    newError
                ],
                loading: false
            });
            return false;
        }
        return true;
    }

    onClickHandler = () => {
        this.setState({loading: true});
        const PROJECT_INFO_SHEET = "Project Information";
        const BOND_INFO_SHEET = "Bond Information";
        const FINANCIAL_INFO_SHEET_PREFIX = "Financial Information - Bonds";
        const CONTRACTOR_INFO_SHEET = "Contractor Information";
        const ENVIRONMENTAL_INFO_SHEET_PREFIX = "Environmental Information";

        const reader = new FileReader();
        reader.onload = (e) => {
            // Clear errors.
            this.setState({
                errors: [],
                
            });

            const result = e.target.result;
            // TODO: parse xlsx error.
            const workbook = XLSX.read(result, {type: 'binary'});

            const projectWorksheet = workbook.Sheets[PROJECT_INFO_SHEET];
            const bondWorksheet = workbook.Sheets[BOND_INFO_SHEET];
            const contractorWorksheet = workbook.Sheets[CONTRACTOR_INFO_SHEET];

            // Check sheets existence.
            const existence1 = this.checkSheetExistence(projectWorksheet, PROJECT_INFO_SHEET);
            const existence2 = this.checkSheetExistence(bondWorksheet, BOND_INFO_SHEET);
            const existence3 = this.checkSheetExistence(contractorWorksheet, CONTRACTOR_INFO_SHEET);
            
            const financialInfoWorksheets = [];
            let existence4 = false;
            workbook.SheetNames.forEach((sheetName) => {
                if (sheetName.startsWith(FINANCIAL_INFO_SHEET_PREFIX)) {
                    financialInfoWorksheets.push(workbook.Sheets[sheetName]);
                    existence4 = true;
                }
            });

            const timeSeriesWorksheets = [];
            let existence5 = false;
            workbook.SheetNames.forEach((sheetName) => {
                if (sheetName.startsWith(ENVIRONMENTAL_INFO_SHEET_PREFIX)) {
                    timeSeriesWorksheets.push(workbook.Sheets[sheetName]);
                    existence5 = true;
                }
            })

            const noFinancialSheetError = 'There is not sheet with name: ' + FINANCIAL_INFO_SHEET_PREFIX + "...";
            const noEnvironmentSheetError = 'There is not sheet with name: ' + ENVIRONMENTAL_INFO_SHEET_PREFIX + "...";
            if (!existence4) {
                this.setState({
                    errors: [
                        ...this.state.errors,
                        noFinancialSheetError
                    ],
                    loading: false
                });
            }
            if (!existence5) {
                this.setState({
                    errors: [
                        ...this.state.errors,
                        noEnvironmentSheetError
                    ],
                    loading: false
                });
            }
            if (!existence1 || !existence2 || !existence3) {
                return;
            }

            const contractors = this.parseContractors(contractorWorksheet, CONTRACTOR_INFO_SHEET);
            const projects = this.parseProjects(projectWorksheet, PROJECT_INFO_SHEET);
            const bonds = this.parseBonds(bondWorksheet, BOND_INFO_SHEET);
            const financialInfo = this.parseFinancialInfo(financialInfoWorksheets);
            const timeSeries = this.parseTimeSeries(timeSeriesWorksheets);

            if (contractors === undefined
            || projects === undefined
            || bonds === undefined
            || financialInfo === undefined
            || timeSeries === undefined) {

                return;
            }

            const json = {
                contractors: contractors,
                projects: projects,
                bonds: bonds,
                financialInfo: financialInfo,
                timeSeries: timeSeries
            }

            console.log("time series:");
            console.log(timeSeries);
            
            axios.post("http://127.0.0.1:8000/api/create", json)
                .then(res => {
                    if (res === undefined || res.status != '200') {
                        this.setState({
                            errors: [
                                ...this.state.errors,
                                'res'
                            ],
                            loading: false
                        });
                    } else {
                        this.setState({
                            errors: [
                                'Upload Successful!'
                            ],
                            loading: false
                        });
                    }
                })
                .catch((error) => {
                    if (!error.response.data.hasOwnProperty('errors')) {
                        this.setState({
                            errors:[
                                ...this.state.errors,
                                'Unknown error!'
                            ],
                            loading: false
                        });
                        return;
                    }
                    error.response.data['errors'].forEach((err) => {
                        this.setState({
                            errors: [
                                ...this.state.errors,
                                err
                            ],
                            loading: false
                        });
                    });
                });
        };

        reader.readAsBinaryString(this.state.file);
    }

    render() {
        const errors = this.state.errors;
        const file = this.state.file;

        return (
            <div>
                <div className = "Swiper">
                
                    <div className="Swiper-item page-one">
        
                    <img className="page-one-bg" src={rush} alt="rush" />
                        <div className="page-one-content">
                            <p className="page-one-title">Welcome to the Issuer Portal</p>
                            <p className="page-one-desc">Share your instutitions progress towards meeting 
                            <br></br>climate-aligned internal goals with investors driven by impact</p>
                        </div>
                    </div>
                </div>
                <div className="download">
                    
                    <p className="download-desc">Our team developed an Excel template for issuers to upload their data to our tool. Be sure to carefully input <br></br>information and read through thoroughly to avoid any errors. </p>
                    <div className="dButtons">
                    {/* sharelink: https://drive.google.com/file/d/1txOF9AIOFd__E9sOEIqSdJxX0tsZCi-H/view?usp=sharing*/}
                    <StyledButton style = {{marginLeft: '267px'}} variant="outlined" className="download-button" href="https://drive.google.com/uc?export=download&amp;id=1txOF9AIOFd__E9sOEIqSdJxX0tsZCi-H"> 
                        <div className="plabel">Download Template</div> 
                        <img className="arrow" src={firstPage} alt="firstPage" />
                    </StyledButton>
                    {/* sharelink: https://drive.google.com/file/d/1txOF9AIOFd__E9sOEIqSdJxX0tsZCi-H/view?usp=sharing*/}
                    <StyledButton  style = {{marginLeft: '267px'}} variant="outlined" className="download-button" > 
                        <div className="plabel">Download Example</div> 
                        <img className="arrow" src={firstPage} alt="firstPage" />
                    </StyledButton>
                    </div>
                </div>
                <div className="upload">
                    <p className="upload-desc">Once you’ve filled out the sheet, double check to ensure that you’ve added your institution’s name and the reporting <br></br>year. This will investors to ensure they are receiving the most up-to-date information from your institution. </p>


                    <input 
                    accept=".xlsx"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={e => this.onChangeHandler(e)} />

                    
                    <StyledButton  style = {{marginLeft: '520px'}} variant="raised" component="span" className="select-button" htmlFor="raised-button-file"> 
                    <label className="select-button" htmlFor="raised-button-file">
                        <div className="plabel">Select File</div>
                        <img className="arrow" src={uploadImg} alt="uploadImg" />
                    </label>
                    </StyledButton>
                    
                    <div className="file">

                    <div className="file-name">
                        <label className="file-label">{`${this.state.selectedFile === null ? 'No File Selected': this.state.selectedFile}`}</label>
                    </div>


                    {
                    this.state.loading ?
                    <div style={{    marginTop: '34px',
                        marginLeft: '30px'}}>
                    <CircularProgress size={20} />
                    </div>
                    
                    :
                    file &&
                        
                        <StyledButton variant="outlined" style={{
                            width: '100px', 
                            height: '40px',
                            marginTop: '34px',
                            marginLeft: '30px'
                        }} 
                            onClick={this.onClickHandler}> 
                        <label className="plabel">Upload</label>
                        
                        </StyledButton>

                    }
                    
                    </div>
                    <div className="errorMessage">
                        {errors && (
                            errors.map(error => <p>{error}</p>)
                        )}
                    </div>
                </div>
            </div>    
        )    
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        errors: state.errors
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, password) => dispatch(actions.authLogin(username, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Uploader);