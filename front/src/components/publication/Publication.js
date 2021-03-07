import './Publication.css';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import back from '../../images/back.svg';
import options from '../../images/options.svg';
import deleteIcon from '../../images/delete.svg';

import Banner from '../banner/Banner';
import Popup from '../popup/Popup';
import LoadingPage from '../loading/LoadingPage';
import Container from '../container/Container';
import PropTypes from 'prop-types';
import reward from '../../images/reward.svg';
import heartEmpty from '../../images/heart_empty.svg';
import heartFill from '../../images/heart_fill.svg';
import camera from '../../images/camera_alt-24px.svg'
import time from '../../images/schedule-24px.svg'
import list from '../../images/toc-24px.svg'

class Publication extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            publication: null,
            isFavorite: false,
            favorites: [],
            isLoading: true,
            isPopupDisplay: false
        };

        this.removePopup = this.removePopup.bind(this);
        this.deletePublication = this.deletePublication.bind(this);
    }

    componentDidMount () {
        const id = this.props.history.location.pathname.split('/')[2];
        APICallManager.getPublication(id, (response) => {
            const publication = response.data;
            APICallManager.getAllTagsByIds(publication.tags, (response) => {
                publication.tags = response.data.map(tag => tag.name);
                this.setState({ publication: publication, isLoading: false });
                console.log(this.state.publication)
            });
            if (this.props.user) {
                APICallManager.getFavoritesOfUser(this.props.user.pseudo, (response) => {
                    this.setState({ favorites: response.data, isFavorite: response.data.includes(publication._id) });
                })
            }
        });
    }

    onBackClicked (event) {
        this.props.history.goBack();
    }

    onDeleteClicked () {
        this.setState({ isPopupDisplay: true });
    }

    removePopup () {
        this.setState({ isPopupDisplay: false });
    }
    
    deletePublication (event) {
        const userConnected = this.props.user;
        const publication = this.state.publication;
        if (userConnected.pseudo !== publication.pseudo && !userConnected.isAdmin) return;

        APICallManager.removePublication(userConnected.pseudo, userConnected.token, publication._id, (response) => {
            if (response.status === 201) {
                this.props.history.goBack();
            }
        })
    }

    onFavoriteClicked (event) {
        if (!this.props.user) return;

        if (this.state.isFavorite) {
            APICallManager.removePublicationFromFavorites(this.props.user.pseudo, this.state.publication._id, (response) => {
                this.setState({
                    isFavorite: !this.state.isFavorite
                })
            });
        } else {
            APICallManager.addPublicationToFavorites(this.props.user.pseudo, this.state.publication._id, (response) => {
                this.setState({
                    isFavorite: !this.state.isFavorite
                })
            });
        }
    }

    render () {
        const isLoading = this.state.isLoading;
        const isFavorite = this.state.isFavorite;
        const userConnected = this.props.user;
        const publication = this.state.publication;
        const isPopupDisplay = this.state.isPopupDisplay;
        return (
            <div>
                <Banner
                    left={
                        <img src={back} className="back-img" onClick={(event) => this.onBackClicked(event)}/>
                    }

                    center={
                        <h1>
                            {!isLoading ? publication.pseudo.capitalize() : ''}
                        </h1>
                    }

                    right={
                        (userConnected && publication && (userConnected.pseudo === publication.pseudo || userConnected.isAdmin))
                            ? <div className="dropdown">
                                <img src={options} className="back-img"/>
                                <div id="options" className="dropdown-content transform-for-profile">
                                    { (userConnected && (userConnected.pseudo === publication.pseudo || userConnected.isAdmin)) &&
                                        <a onClick={ (event) => this.onDeleteClicked(event) } >Delete <img src={deleteIcon}/></a>
                                    }
                                </div>
                            </div>
                            : (userConnected)
                            ? <Link to={'/profile/' + userConnected.pseudo} >
                                <img className="user-pic" src={userConnected.profileImageLink}/>
                            </Link>
                            : <Link to="/login">
                                <button className="button-marble">
                                    Log in
                                </button>
                            </Link>
                    }
                />
                <Container>
                        {isLoading
                            ? <LoadingPage/>
                            : <div className="publication-page">
                                <img className="publication-img" src={publication.imageLink}/>
                                <p className="publication-date"> {publication.date}</p>
                                <div>
                                    <div className="publication-informations">
                                        <div className="publication-tags">
                                            {publication.tags.map((tag, index) => (
                                              <p key={index}> &#x3A6; {tag.capitalize()}</p>
                                            ))}
                                        </div>
                                        <div className="publication-points">
                                            <p>Score : {publication.points}</p>
                                        </div>
                                        <div className="publication-votes">
                                            <img className="vote-img" src={reward} />
                                            <p>{publication.rank}</p>
                                        </div>
                                        {   
                                            userConnected &&
                                            <div className='transform-scale' onClick={ (event) => this.onFavoriteClicked(event)}>
                                                {isFavorite
                                                ? <img className="favorite-img" src={heartFill}/>
                                                : <img className="favorite-img" src={heartEmpty}/>}
                                            </div>
                                        }
                                    </div>
                                    { (publication.metaDatas != null)
                                      ? <div className="publication-exifs">
                                          {
                                            (publication.metaDatas.cameraModel != null) &&
                                            <div className="exif-container">
                                              <img className="exif-image" src={camera}/>
                                              <p> {publication.metaDatas.cameraModel} </p>
                                            </div>
                                          }
                                          {
                                            (publication.metaDatas.dateAndTimeOfCreation != null) &&
                                            <div className="exif-container">
                                              <img className="exif-image" src={time}/>
                                              <p>{publication.metaDatas.dateAndTimeOfCreation} </p>
                                            </div>
                                          }
                                          {
                                            (publication.metaDatas.expositionTime != null) &&
                                            <div className="exif-container">
                                                <img className="exif-image" src={list}/>
                                                <p> {publication.metaDatas.expositionTime}s {publication.metaDatas.focalLength}mm F/{publication.metaDatas.focal} </p>
                                            </div>
                                          }
                                          
                                        </div>
                                      : <div/> }
                                </div>
                                <div className="publication-description">
                                    <p >{publication.description}</p>
                                </div>
                                {
                                        isPopupDisplay &&
                                        <Popup title="Do you really want to delete this publication ?" actionOnCancel={this.removePopup} actionOnValidate={this.deletePublication}
                                            center={ 
                                                <div>
                                                    <img src={publication.imageLink}/>
                                                </div> 
                                            }
                                        />
                                    }
                            </div>
                        }
                </Container>
            </div>
        );
    }
}

Publication.propTypes = {
    history: PropTypes.object,
    user: PropTypes.object
}

export default withRouter(Publication);
