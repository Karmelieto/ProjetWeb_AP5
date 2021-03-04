import './Login.css';
import React from 'react';
import APICallManager from '../../app/APICallManager';
import back from '../../images/back.svg';
import logo from '../../images/logo.svg';
import Banner from '../banner/Banner';
import Container from '../container/Container';
import LoadingPage from '../loading/LoadingPage';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class Login extends React.Component {

    state = {
        isLoading: false,
        emailInput: '',
        emailError: '',
        passwordInput: '',
        passwordError: ''
    };

    onBackClicked (event) {
        const comingFrom = this.props.history.location.search.split('=')[1];
        console.log(comingFrom);
        if (comingFrom === 'postpublication' || comingFrom === 'play') {
            this.props.history.goBack();
            this.props.history.goBack();
        } else {
            this.props.history.goBack();
        } 
    }

    onLoginClicked (event) {
        this.removeErrorOnInput('emailInput');
        this.removeErrorOnInput('passwordInput');
        event.preventDefault();
        if (this.handleValidation()) {
            APICallManager.login(this.state.emailInput, this.state.passwordInput, (response) => {
                localStorage.setItem('user', JSON.stringify(response.data));
                this.props.updateUser();
                this.props.history.goBack();
            }, (error) => {
                if (error.response.data.statusCode === 404) {
                    this.setErrorOnInput('emailInput');
                    this.setState({ emailError: 'Email is not in our database.' });
                } else if (error.response.data.statusCode === 401) {
                    this.setErrorOnInput('passwordInput');
                    this.setState({ passwordError: 'Password is wrong.' });
                }
            });
        }
    }

    setErrorOnInput (id) {
        const input = document.getElementById(id);
        input.classList.add('input-error');
    }

    removeErrorOnInput (id) {
        const input = document.getElementById(id);
        input.classList.remove('input-error');
    }

    handleValidation () {
        const password = this.state.passwordInput;
        const email = this.state.emailInput;

        let isValid = true;

        this.setState({ emailError: '', passwordError: '' });
        this.removeErrorOnInput('emailInput');
        this.removeErrorOnInput('passwordInput');

        if (email === '') {
            this.setState({ emailError: 'Email is empty.' });
            console.log(this.state.emailError);
            this.setErrorOnInput('emailInput');
            isValid = false;
        }

        if (!email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
            this.setState({ emailError: 'Wrong email address.' });
            this.setErrorOnInput('emailInput');
            isValid = false;
        }

        if (password === '') {
            this.setState({ passwordError: 'Password is empty.' });
            this.setErrorOnInput('passwordInput');
            isValid = false;
        }

        return isValid;
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
        const emailError = this.state.emailError;
        const passwordError = this.state.passwordError;
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
                                ? <LoadingPage/>
                                : <div className="login-content full-page">
                                    <img src={logo} className="logo margin-bottom"/>
                                    <span className="error">{emailError}</span>
                                    <input id="emailInput" className="input margin-bottom" placeholder="Email" type="email" onChange={ (event) => this.handleEmailInputChange(event) }/>
                                    <span className="error">{passwordError}</span>
                                    <input id="passwordInput" className="input margin-bottom" placeholder="Password" type="password" onChange={ (event) => this.handlePasswordInputChange(event) }/>
                                    <button className="margin-bottom button-marble" onClick={ (event) => this.onLoginClicked(event) }>
                                        Log in
                                    </button>
                                    <NavLink className="register" to="/register">Register</NavLink>
                                </div>
                            }
                        </div>
                    </Container>
                </div>
        );
    }
}

Login.propTypes = {
    history: PropTypes.object,
    updateUser: PropTypes.func.isRequired
}

export default withRouter(Login);
