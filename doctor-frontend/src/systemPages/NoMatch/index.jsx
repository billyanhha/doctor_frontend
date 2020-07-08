import React from 'react';
import "./style.css"
import { withRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const NoMatch = (props) => {

    return (
        <div className = "default-div">
            <Navbar/>
            <div>
                <center><h1>404 NOT FOUND</h1></center>
            </div>
            <div></div>
        </div>
    );
};

export default withRouter(NoMatch);