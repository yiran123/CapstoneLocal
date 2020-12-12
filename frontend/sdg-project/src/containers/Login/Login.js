import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress'


import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';
import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';

import { ThemeProvider } from "@material-ui/styles";
import './Login.css';

const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#a9c144',
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(1),
  },


});

const theme = createMuiTheme({
  palette: {
    primary: {
        main:'#a9c144',
    }
  },

});

const theme2 = createMuiTheme();

theme.typography.h4 = {
  fontSize: '1.2rem',
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
    fontWeight: "bold",
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.4rem',
  },
};


const LoginButton = styled(Button)`

  color: white;
  height: 40px;
  
  &.MuiButton-containedPrimary{
    background-color: #7A961F;
    margin-top:10px;
    &:hover{
      background-color: #7A961F;
      }
  }
  
`;


class NormalLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: '',
        }

    }
    

    onFinish = (event) => {
      event.preventDefault();

        this.props.onAuth(this.state.username, this.state.password);
    }



    render() {
        const { classes } = this.props;
        let errorMessage = null;
        if (this.props.error  ) {
            errorMessage = (
                "Username or password is incorrect! "
            )
        }
        
        return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <ThemeProvider theme={theme2}>
        <Typography component="h4" variant="h4">
          Sign in
        </Typography>
        </ThemeProvider>
        {
          this.props.loading ?
          <CircularProgress size={20} />
          :

        
        <form className={classes.form} onSubmit={this.onFinish}>
         <ThemeProvider theme={theme}>
         <div className="errorMessage">
         {errorMessage}
         </div>
          <TextField
            className={classes.margin}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={this.state.username}
            onInput={ e=>this.setState({username: e.target.value})}
            autoComplete="username"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            value={this.state.password}
            onInput={ e=>this.setState({password: e.target.value})}
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          

          </ThemeProvider>
        <LoginButton fullWidth variant="contained" color="primary" type="submit">
            LOGIN
        </LoginButton>

        </form>
    }
      </div>
 

    </Container>
            
            
        );
    }
};

const mapStateToProps = (state) => {
    return {  
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, password) => dispatch(actions.authLogin(username, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (withStyles(useStyles, {withTheme: true}) (NormalLoginForm));
