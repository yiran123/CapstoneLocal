import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from './history';


import InvestorPortal from "./pages/InvestorPortal";
import DetailContent from "./components/DetailContent/DetailContent";
import Login from './containers/Login/Login';
import Uploader from './containers/Uploader/Uploader';
import WaterProject from "./components/WaterProject/WaterProject";



export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={InvestorPortal} />
                    <Route path="/bond/:id" component={DetailContent} />
                    <Route path="/login" component={Login} />
                    <Route path='/upload' component={Uploader} />
                    <Route path="/project/:id" component={WaterProject} />

                </Switch>
            </Router>
        )
    }
}