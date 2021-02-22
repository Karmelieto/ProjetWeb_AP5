import '../login/Login.css';
import './Register.css';
import React from 'react';
import APICallManager from '../../app/APICallManager';
import back from '../../images/back.svg';
import logo from '../../images/logo.svg';
import Banner from '../banner/Banner';
import Container from '../container/Container';
import Loading from '../loading/Loading';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class Register extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            isLoading: false,
            emailInput: '',
            emailError: '',
            pseudoInput: '',
            pseudoError: '',
            passwordInput: '',
            passwordError: ''
        };
    }

    onRegisterClicked (event) {
        event.preventDefault();
        if (this.handleValidation()) {
            // this.setState({ isLoading: true });
            APICallManager.register(this.state.emailInput, this.state.pseudoInput, this.state.passwordInput, (response) => {
                this.setState({ isLoading: false });
                localStorage.setItem('user', JSON.stringify(response.data));
                this.props.updateUser();
                this.props.history.push('/');
            }, (error) => {
                this.setState({ isLoading: false })
                // console.log(error.response.data.message);
                if (!error.response) {
                    return;
                }

                if (error.response.data.message.indexOf('name') > 0) {
                    this.setState({ pseudoError: 'Pseudo alreay taken.' });
                    this.setErrorOnInput('pseudoInput');
                } else if (error.response.data.message.indexOf('mail') > 0) {
                    this.setState({ emailError: 'Email alreay taken.' });
                    this.setErrorOnInput('emailInput');
                }   
            });
        }
    }

    onBackClicked (event) {
        this.props.history.goBack();
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
        const pseudo = this.state.pseudoInput;

        let isValid = true;

        this.setState({ emailError: '', passwordError: '', pseudoError: '' });
        this.removeErrorOnInput('pseudoInput');
        this.removeErrorOnInput('emailInput');
        this.removeErrorOnInput('passwordInput');

        if (pseudo === '') {
            this.setState({ pseudoError: 'Pseudo is empty.' });
            this.setErrorOnInput('pseudoInput');
            isValid = false;
        }

        if (email === '') {
            this.setState({ emailError: 'Email is empty.' });
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

    handlePseudoInputChange (event) {
        event.preventDefault();
        this.setState({ pseudoInput: event.target.value });
    }

    handlePasswordInputChange (event) {
        event.preventDefault();
        this.setState({ passwordInput: event.target.value });
    }

    render () {
        const isLoading = this.state.isLoading;
        const pseudoError = this.state.pseudoError;
        const emailError = this.state.emailError;
        const passwordError = this.state.passwordError;
        return (
                <div className="full-page flex">
                    <Banner 
                        left={
                            <img src={back} className="back-img" onClick={ (event) => this.onBackClicked(event) }/>
                        }
                        right={
                            <Link to="/">
                                <img src= {logo}/>
                            </Link>
                        }
                    />
                    <Container>
                        <div className="full-page">
                            {isLoading
                                ? <Loading/>
                                : <div className="login-content full-page">
                                    <p className="register-title margin-bottom">Join us !</p>
                                    <span className="error">{pseudoError}</span>
                                    <input id="pseudoInput" className="input margin-bottom" placeholder="Pseudo" type="text" onChange={ (event) => this.handlePseudoInputChange(event) }/>
                                    <span className="error">{emailError}</span>
                                    <input id="emailInput" className="input margin-bottom" placeholder="Email" type="text" onChange={ (event) => this.handleEmailInputChange(event) }/>
                                    <span className="error">{passwordError}</span>
                                    <input id="passwordInput" className="input margin-bottom" placeholder="Password" type="password" onChange={ (event) => this.handlePasswordInputChange(event) }/>
                                    <button onClick={ (event) => this.onRegisterClicked(event) } className="margin-top button-marble">
                                        Register
                                    </button>
                                </div>
                            }
                        </div>
                    </Container>
                </div>
        );
    }
}

Register.propTypes = {
    history: PropTypes.object,
    updateUser: PropTypes.func.isRequired
}

export default withRouter(Register);
