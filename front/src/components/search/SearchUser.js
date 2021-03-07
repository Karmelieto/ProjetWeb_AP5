import './Search.css';
import React from 'react';
import { Link } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import logo from '../../images/logo.svg'
import Banner from '../banner/Banner';
import LoadingPage from '../loading/LoadingPage';
import Container from '../container/Container';
import UserListItem from '../userListItem/UserListItem';
import PropTypes from 'prop-types';

class SearchUser extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            users: [],
            isLoading: true,
            inputSearch: ''
        };
    }

    componentDidMount () {
       this.getUsers(this.state.inputSearch);
    }

    getUsers (pseudoInput) {
        if (pseudoInput) {
            APICallManager.getUsersByPseudo(pseudoInput, (response) => {
                this.setState({
                    users: response.data,
                    isLoading: false
                });
            });
        } else {
            APICallManager.getUsers((response) => {
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
                            <Link to="/"><img src={logo} /></Link>
                        }
                        center={
                            <input placeholder='User name' value={inputSearch} onChange={ event => this.handleInputChange(event)}/>
                        }
                        right = {
                            <div>
                                {
                                    !user
                                    ? <Link to="/login?comingFrom=searchuser">
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
                                : (users.length === 0)
                                    ? <div className="not-found">No user found !</div>
                                    : users.map((user, index) => (
                                        <Link style={{ textDecoration: 'none', color: '#0d0d0d', maxWidth: '200px' }} to={'/profile/' + user.pseudo} key={index}>
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

SearchUser.propTypes = {
    user: PropTypes.object
}

export default SearchUser;
