import './Profile.css';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import back from '../../images/back.svg';

import Banner from '../banner/Banner';
import LoadingPage from '../loading/LoadingPage';
import Container from '../container/Container';
import ProfileInformation from './ProfileInformation';
import Gallery from '../gallery/Gallery';
import PropTypes from 'prop-types';

class Profile extends React.Component {

    state = {
        user: null,
        publications: [],
        isLoading: true
    };

    componentDidMount () {
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
                            <div>
                                {
                                    !isLoading && (
                                        (userConnected)
                                        ? <Link to={'/profile/' + userConnected.pseudo} >
                                            <img className="user-pic" src={userConnected.profileImageLink}/>
                                        </Link>
                                        : <Link to="/login?comingFrom=profile">
                                            <button className="button-marble">
                                                Log in
                                            </button>
                                        </Link>
                                    )
                                }
                                
                            </div>
                        }
                    />
                    <Container>
                        <div>
                            {isLoading
                                ? <LoadingPage/>
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

Profile.propTypes = {
    history: PropTypes.object,
    user: PropTypes.object
}

export default withRouter(Profile);
