import './Search.css';
import React from 'react';
import { Link } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import logo from '../../images/logo.svg'
import Banner from '../banner/Banner';
import LoadingPage from '../loading/LoadingPage';
import Container from '../container/Container';
import Gallery from '../gallery/Gallery'
import PropTypes from 'prop-types';
import SearchList from './SearchList';

class SearchTag extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            publications: [],
            tags: [],
            isLoading: true,
            inputSearch: ''
        };

        this.onTagSelected = this.onTagSelected.bind(this);
    }

    componentDidMount () {
        if (this.props.tag) {
            this.setState({ inputSearch: this.props.tag });
            this.getPublications(this.props.tag);
        }
    }

    getTags (tagName) {
        if (tagName) {
            let pseudo = '';
            if (this.props.user) {
                pseudo = this.props.user.pseudo;
            }
            APICallManager.getTagsByName(tagName, pseudo, (response) => {
                this.setState({
                    tags: response.data
                });
            });
        } else {
            this.setState({
                tags: []
            });
        }
    }

    getPublications (tagName) {
        if (tagName) {
            this.setState({ isLoading: true });
            APICallManager.getPublicationsByTag(tagName, (response) => {
                this.setState({
                    publications: response.data,
                    isLoading: false
                });
            });
        }
    }

    onTagSelected (clickedOn) {
        this.setState({ inputSearch: clickedOn.name });
        this.getPublications(clickedOn.name);
    }

    handleInputChange (event) {
        event.preventDefault();
        this.setState({ inputSearch: event.target.value });
        this.getTags(event.target.value.trim());
    }

    render () {
        const isLoading = this.state.isLoading;
        const inputSearch = this.state.inputSearch;
        const tags = this.state.tags;
        const user = this.props.user;
        const publications = this.state.publications
        return (
                <div>
                    <Banner 
                        left={
                            <img src={logo}/>
                        }
                        center={
                            <div className="input-button dropdown">
                                <input value={inputSearch} onChange={ event => this.handleInputChange(event) }/>
                                <SearchList elements={tags} actionOnClick={ this.onTagSelected } type="&#x3A6;"/>
                                <Link to="/search/users">
                                    <button className="button-marble">
                                        &#x3A6;
                                    </button>
                                </Link>
                            </div>
                        }
                        right = {
                            <div>
                                {
                                    !user
                                    ? <Link to="/login?comingFrom=searchtag">
                                        <button className="button-marble">
                                            Log in
                                        </button>
                                    </Link>
                                    : <Link to={'/profile/' + user.pseudo}>
                                        <img className="user-pic" src={user.profileImageLink}/>
                                    </Link>
                                }
                                
                            </div>
                        }
                    />
                    <Container>
                        <div className='search'>
                            {isLoading
                                ? <LoadingPage/>
                                : <Gallery publications={publications} />
                            }  
                          </div>
                    </Container>
                </div>
        );
    }
}

SearchTag.propTypes = {
    user: PropTypes.object,
    tag: PropTypes.string
}

export default SearchTag;
