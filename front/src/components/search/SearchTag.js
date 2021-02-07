import './Search.css';
import React from 'react';
import { Link } from 'react-router-dom';
// import APICallManager from '../../app/APICallManager';
import logo from '../../images/logo.svg'
import Banner from '../banner/Banner';
import Loading from '../loading/Loading';
import Container from '../container/Container';
import PropTypes from 'prop-types';

class SearchTag extends React.Component {

    state = {
        posts: [],
        isLoading: true,
        inputSearch: ''
    };

    componentDidMount () {
        if (this.props.tag) {
            this.setState({ inputSearch: this.props.tag });
        }
    }

    handleInputChange (event) {
        event.preventDefault();
        this.setState({ inputSearch: event.target.value });
    }

    render () {
        const isLoading = this.state.isLoading;
        const inputSearch = this.state.inputSearch;
        // const posts = this.state.posts;
        const user = this.props.user;
        return (
                <div>
                    <Banner 
                        left={
                            <img src={logo}/>
                        }
                        center={
                            <div className="input-button">
                                <input value={inputSearch} onChange={ event => this.handleInputChange(event)}/>
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
