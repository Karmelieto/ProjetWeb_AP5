import './Publication.css';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import back from '../../images/back.svg';
import options from '../../images/options.svg';

import Banner from '../banner/Banner';
import LoadingPage from '../loading/LoadingPage';
import Container from '../container/Container';
import PropTypes from 'prop-types';
import reward from '../../images/reward.svg';
import heartEmpty from '../../images/heart_empty.svg';
import heartFill from '../../images/heart_fill.svg';

class Publication extends React.Component {

    state = {
        publication: null,
        isFavorite: false,
        favorites: [],
        isLoading: true
    } ;

    componentDidMount () {
        const id = this.props.history.location.pathname.split('/')[2];
        APICallManager.getPublication(id, (response) => {
            const publication = response.data;
            APICallManager.getAllTagsByIds(publication.tags, (response) => {
                publication.tags = response.data.map(tag => tag.name);
                this.setState({ publication: publication, isLoading: false });
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
                        (userConnected && publication && userConnected.pseudo === publication.pseudo)
                            ? <div className="dropdown">
                                <img src={options} className="back-img"/>
                                <div id="options" className="dropdown-content transform-for-profile">

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
                                        <div className="publication-votes">
                                            <img className="vote-img" src={reward} />
                                            <p>{publication.rank}</p>
                                        </div>
                                        <div onClick={ (event) => this.onFavoriteClicked(event)}>
                                            {isFavorite
                                              ? <img className="favorite-img" src={heartFill}/>
                                              : <img className="favorite-img" src={heartEmpty}/>}
                                        </div>
                                    </div>
                                    <div className="publication-exifs">
                                        <p> Modèle de caméra : </p>
                                        <p> Distance focale : </p>
                                        <p> Ouverture : </p>
                                    </div>
                                    {
                                        userConnected &&
                                        <div onClick={ (event) => this.onFavoriteClicked(event)}>
                                            {isFavorite
                                            ? <img className="favorite-img" src={heartFill}/>
                                            : <img className="favorite-img" src={heartEmpty}/>}
                                        </div>
                                    }
                                </div>
                                <div className="publication-description">
                                    <p >{publication.description}</p>
                                </div>
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
