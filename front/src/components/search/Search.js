import './Search.css';
import React from 'react';
import { Link } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import logo from '../../images/logo.svg'
import Banner from '../banner/Banner';
import Loading from '../loading/Loading';
import Container from '../container/Container';
import UserListItem from '../userListItem/UserListItem';
import PropTypes from 'prop-types';

class Search extends React.Component {

    state = {
        users: [],
        isLoading: true,
        inputSearch: ''
    };

    componentDidMount () {
       this.getUsers('');
    }

    getUsers (pseudoInput) {
        if (pseudoInput) {
            APICallManager.getUsersByPseudo(pseudoInput, (response) => {
                response.data.map((user, index) => (user.key = index));
                this.setState({
                    users: response.data,
                    isLoading: false
                });
            });
        } else {
            APICallManager.getUsers((response) => {
                response.data.map((user, index) => (user.key = index));
                this.setState({
                    users: response.data,
                    isLoading: false
                });
            });
        }
    }

    handleInputChange (event) {
        event.preventDefault();
        this.setState({ inputSearch: event.target.value });
        this.getUsers(event.target.value.trim());
    }

    render () {
        const isLoading = this.state.isLoading;
        const inputSearch = this.state.inputSearch;
        const users = this.state.users;
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
                                <button>
                                    User
                                </button>
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
                                : users.map(user => (
                                    <Link style={{ textDecoration: 'none', color: '#0d0d0d' }} to={'/profile/' + user.pseudo} key={user.key}>
                                        <UserListItem user={user}/>
                                    </Link>
                                ))
                            }
                        </div>
                    </Container>
                </div>
        );
    }
}

Search.propTypes = {
    user: PropTypes.object
}

export default Search;
