import './Profile.css';
import React from 'react';
import { withRouter } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import back from '../../images/back.svg';
import options from '../../images/options.svg';
import disconnect from '../../images/disconnect.svg';
import edit from '../../images/edit.svg';
import publicationsIcon from '../../images/publications.svg';
import favoritesIcon from '../../images/heart_fill.svg';

import Banner from '../banner/Banner';
import LoadingPage from '../loading/LoadingPage';
import Container from '../container/Container';
import ProfileInformation from './ProfileInformation';
import Popup from '../popup/Popup';
import Gallery from '../gallery/Gallery';
import PropTypes from 'prop-types';

class MyProfile extends React.Component {

    constructor (props) {
        super(props);

        this.removePopup = this.removePopup.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);

        this.state = {
            user: null,
            publications: [],
            favorites: [],
            isLoading: true,
            isFavoriteDisplay: false,
            isPopupDisplay: false
        };
    }

    componentDidMount () {
        if (!this.props.user) {
            console.error('CANT FIND USER');
            this.props.history.push('/');
            return;
        }
        const pseudo = this.props.history.location.pathname.split('/')[2];
        APICallManager.getUser(pseudo, (response) => {
            this.setState({ user: response.data, isLoading: false });
            this.onPublicationsClicked(response.data.pseudo);
        }, (error) => {
            console.log(error);
            this.props.history.push('/');
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
       this.setState({ isPopupDisplay: true });
    }

    removePopup () {
        this.setState({ isPopupDisplay: false });
    }

    deleteAccount () {
        if (!this.state.user || !this.props.user) return;
        APICallManager.deleteUser(this.state.user.pseudo, this.props.user.pseudo);
        this.setState({ isPopupDisplay: true });
        if (this.state.user.pseudo === this.props.user.pseudo) this.onDisconnect();
        else this.props.history.push('/');
    }

    onPublicationsClicked (pseudo) {
        this.setState({ isFavoriteDisplay: false });
        if (this.state.publications.length === 0) {
            APICallManager.getPublicationsOfUser(pseudo, (response) => {
                this.setState({ publications: response.data, isLoading: false });
            }, (error) => {
                console.log(error);
            });
        }
    }

    onFavoriteClicked (event) {
        this.setState({ isFavoriteDisplay: true });
        if (this.state.favorites.length === 0 && this.state.user.favorites.length !== 0) {
            APICallManager.getPublicationsByArrayOfId(this.state.user.favorites, (response) => {
                if (response.data) {
                    this.setState({ favorites: response.data });
                }
            }, (error) => {
                console.log(error);
            });
        }
    }

    render () {
        const isLoading = this.state.isLoading;
        const userConnected = this.props.user;
        const user = this.state.user;
        const publications = this.state.publications;
        const favorites = this.state.favorites;
        const isFavoriteDisplay = this.state.isFavoriteDisplay;
        const isPopupDisplay = this.state.isPopupDisplay;
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
                                ? <LoadingPage/>
                                : <div>
                                    <ProfileInformation user={user}/>
                                    {
                                        isPopupDisplay &&
                                        <Popup title="Do you really want do delete this account ?" actionOnCancel={this.removePopup} actionOnValidate={this.deleteAccount}/>
                                    }
                                    <div className="flex-nowrap select-post">
                                        <div onClick={ (event) => this.onPublicationsClicked(event)} className={!isFavoriteDisplay ? 'selected' : ''}>
                                            <img src={publicationsIcon}/>
                                        </div>
                                        <div onClick={ (event) => this.onFavoriteClicked(event)} className={isFavoriteDisplay ? 'selected' : ''}>
                                            <img src={favoritesIcon}/>
                                        </div>
                                    </div>
                                    {
                                        !isFavoriteDisplay
                                        ? <Gallery publications={publications}/>
                                        : <Gallery publications={favorites}/>
                                    }
                                    
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
