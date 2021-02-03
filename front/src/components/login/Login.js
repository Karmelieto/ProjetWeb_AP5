import './Login.css';
import React from 'react';
import APICallManager from '../../app/APICallManager';
import back from '../../images/back.svg';
import logo from '../../images/logo.svg';
import Banner from '../banner/Banner';
import Container from '../container/Container';
import Loading from '../loading/Loading';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class Login extends React.Component {

    state = {
        isLoading: false,
        emailInput: '',
        passwordInput: ''
    };

    onBackClicked (event) {
        this.props.history.goBack();
    }

    onLoginClicked (event) {
        APICallManager.login(this.state.emailInput, this.state.pseudo, (response) => {

        });
    }

    handleEmailInputChange (event) {
        event.preventDefault();
        this.setState({ emailInput: event.target.value });
    }

    handlePasswordInputChange (event) {
        event.preventDefault();
        this.setState({ passwordInput: event.target.value });
    }

    render () {
        const isLoading = this.state.isLoading;
        return (
                <div className="full-page">
                    <Banner 
                        left={
                            <img src={back} className="back-img" onClick={ (event) => this.onBackClicked(event) }/>
                        }
                    />
                    <Container>
                        <div className="full-page">
                            {isLoading
                                ? <Loading/>
                                : <div className="login-content full-page">
                                    <img src={logo} className="logo"/>
                                    <input className="input margin-top" placeholder="Email" type="email" onChange={ (event) => this.handleEmailInputChange(event) }/>
                                    <input className="input margin-top" placeholder="Password" type="password" onChange={ (event) => this.handlePasswordInputChange(event) }/>
                                    <button className="margin-top" onClick={ (event) => this.onLoginClicked(event) }>
                                        Log in
                                    </button>
                                    <NavLink className="margin-top register" to="/register">Register</NavLink>
                                </div>
                            }
                        </div>
                    </Container>
                </div>
        );
    }
}

Login.propTypes = {
    history: PropTypes.object
}

export default withRouter(Login);
