import './Search.css';
import React from 'react';
import { Link } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import logo from '../../images/logo.svg'
import Banner from '../banner/Banner';
import Loading from '../loading/Loading';
import Container from '../container/Container';
import PropTypes from 'prop-types';
import SearchList from './SearchList';

class SearchTag extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            posts: [],
            tags: [],
            isLoading: true,
            inputSearch: ''
        };

        this.onTagSelected = this.onTagSelected.bind(this);
    }

    componentDidMount () {
        if (this.props.tag) {
            this.setState({ inputSearch: this.props.tag });
        }
    }

    getTags (tagName) {
        if (tagName) {
            APICallManager.getTagsByName(tagName, (response) => {
                response.data.map((tag, index) => (tag.key = index));
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

    onTagSelected (clickedOn) {
        console.log('SELECTED ! ' + clickedOn);
        this.setState({ inputSearch: clickedOn });
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
                                    <button>
                                        &#x3A6;
                                    </button>
                                </Link>
                            </div>
                        }
                        right = {
                            <div>
                                {
                                    !user
                                    ? <Link to="/login">
                                        <button>
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
                                ? <Loading/>
                                : <Loading/>
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
