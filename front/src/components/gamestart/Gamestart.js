import './Gamestart.css';
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Banner from '../banner/Banner';
// import back from '../../images/back.svg';
import logo from '../../images/logo.svg'
// import { Link, withRouter } from 'react-router-dom';
// import APICallManager from '../../app/APICallManager';
// import back from '../../images/back.svg';
// import Banner from '../banner/Banner';

class Gamestart extends React.Component {

    onBackClicked (event) {
        this.props.history.goBack();
    }

    render () {
        return (
            <div>
                <Banner
                left={
                    <img src={logo} className="back-img" onClick={ (event) => this.onBackClicked(event) }/>
                }
                />
            </div>
        );
    }
}
Gamestart.PropTypes = {
    hystory: PropTypes.object,
    user: PropTypes.object
}
export default withRouter(Gamestart);
