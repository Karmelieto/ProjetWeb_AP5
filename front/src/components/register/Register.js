import '../login/Login.css';
import React from 'react';
import APICallManager from '../../app/APICallManager';
import back from '../../images/back.svg';
import logo from '../../images/logo.svg';
import Banner from '../banner/Banner';
import Container from '../container/Container';
import Loading from '../loading/Loading';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class Register extends React.Component {

    state = {
        isLoading: false,
        emailInput: '',
        pseudo: '',
        passwordInput: ''
    };

    onBackClicked (event) {
        this.props.history.goBack();
    }

    onRegisterClicked (event) {
        APICallManager.register(this.state.emailInput, this.state.pseudo, this.state.passwordInput, (response) => {

        });
    }

    handleEmailInputChange (event) {
        event.preventDefault();
        this.setState({ emailInput: event.target.value });
    }

    handlePseudoInputChange (event) {
        event.preventDefault();
        this.setState({ pseudo: event.target.value });
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
                                    <input className="input margin-top" placeholder="Email" type="text" onChange={ (event) => this.handleEmailInputChange(event) }/>
                                    <input className="input margin-top" placeholder="Pseudo" type="text" onChange={ (event) => this.handlePseudoInputChange(event) }/>
                                    <input className="input margin-top" placeholder="Password" type="password" onChange={ (event) => this.handlePasswordInputChange(event) }/>
                                    <button onClick={ (event) => this.onRegisterClicked(event) } className="margin-top">
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
    history: PropTypes.object
}

export default withRouter(Register);
