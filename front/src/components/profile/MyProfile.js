import './Profile.css';
import React from 'react';
import { withRouter } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import back from '../../images/back.svg';
import options from '../../images/options.svg';
import disconnect from '../../images/disconnect.svg';
import edit from '../../images/edit.svg';

import Banner from '../banner/Banner';
import Loading from '../loading/Loading';
import Container from '../container/Container';
import ProfileInformation from './ProfileInformation';
import Gallery from '../gallery/Gallery';
import PropTypes from 'prop-types';

class MyProfile extends React.Component {

    state = {
        user: null,
        publications: [],
        isLoading: true
    };

    componentDidMount () {
        if (!this.props.user) {
            console.error('CANT FIND USER');
            this.props.history.push('/');
            return;
        }
        const pseudo = this.props.history.location.pathname.split('/')[2];
        APICallManager.getUser(pseudo, (response) => {
            APICallManager.getPublicationsOfUser(response.data.pseudo, (secondResponse) => {
                this.setState({ user: response.data, publications: secondResponse.data, isLoading: false });
            }, (error) => {
                console.log(error);
            });
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

    onEdit (event) {

    }

    render () {
        const isLoading = this.state.isLoading;
        const userConnected = this.props.user;
        const user = this.state.user;
        const publications = this.state.publications;
        return (
                <div>
                    <Banner 
                        left={
                            <img src={back} className="back-img" onClick={ (event) => this.onBackClicked(event) }/>
                        }

                        center= {
                            <h1>
                                { !isLoading ? user.pseudo.capitalize() : ''}
                            </h1>
                        }

                        right = {
                            <div className="dropdown">
                                <img src={options} className="back-img"/>
                                <div id="options" className="dropdown-content transform-for-profile">
                                    { (user && userConnected.pseudo === user.pseudo) &&
                                        <a onClick={ (event) => this.onDisconnect(event) } >Disconnect <img src={disconnect}/></a>
                                    }
                                    { (user && (userConnected.pseudo === user.pseudo || userConnected.isAdmin)) &&
                                        <a onClick={ (event) => this.onEdit(event) } >Edit <img src={edit}/></a>
                                    }
                                </div>
                            </div>
                        }
                    />
                    <Container>
                        <div>
                            {isLoading
                                ? <Loading/>
                                : <div>
                                    <ProfileInformation user={user}/>
                                    <Gallery publications={publications}/>
                                </div>
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
