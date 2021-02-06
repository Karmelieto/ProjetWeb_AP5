import './Profile.css';
import React from 'react';
import { withRouter } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import back from '../../images/back.svg';

import Banner from '../banner/Banner';
import Loading from '../loading/Loading';
import Container from '../container/Container';
import PropTypes from 'prop-types';

class MyProfile extends React.Component {

    state = {
        user: null,
        isLoading: true
    };

    componentDidMount () {
        if (!this.props.user) {
            console.error('CANT FIND USER');
            this.props.history.push('/');
            return;
        }
        APICallManager.getUser(this.props.user.pseudo, (response) => {
            this.setState({ user: response.data, isLoading: false });
        }, (error) => {
            console.log(error);
        });
    }
    
    onBackClicked (event) {
        this.props.history.goBack();
    }

    onDisconnect (event) {
        this.props.clearUser();
        this.props.history.push('/');
    }
    
    render () {
        const isLoading = this.state.isLoading;
        const user = this.state.user;
        return (
                <div>
                    <Banner 
                        left={
                            <img src={back} className="back-img" onClick={ (event) => this.onBackClicked(event) }/>
                        }

                        center= {
                            <h1>
                                { !isLoading ? user.pseudo : ''}
                            </h1>
                        }

                        right = {
                            <div>
                                 <button onClick={ (event) => this.onDisconnect(event) }>
                                    Disconnect
                                </button>
                            </div>
                        }
                    />
                    <Container>
                        <div>
                            {isLoading
                                ? <Loading/>
                                : <Loading/>
                            }
                        </div>
                    </Container>
                </div>
        );
    }
}

MyProfile.propTypes = {
    history: PropTypes.object,
    user: PropTypes.object,
    clearUser: PropTypes.func.isRequired
}

export default withRouter(MyProfile);
