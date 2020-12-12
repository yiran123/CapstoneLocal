import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './containers/Header/Header'
import Menu from './components/Menu/Menu'
import './App.css';
import Routes from './Routes';
import * as actions from './store/actions/auth';


class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    return (
      <div className="App">
        <Header {...this.props} />
        <Menu />
        <div className="LayoutWrapper">
           <Routes />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
