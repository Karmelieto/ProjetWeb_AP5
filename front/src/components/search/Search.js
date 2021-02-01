import './Search.css';
import React from 'react';
import { Link } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import logo from '../../images/logo.svg'
import Banner from '../banner/Banner';
import Loading from '../loading/Loading';
import Container from '../container/Container';
import UserListItem from '../userListItem/UserListItem';

class Search extends React.Component {

    state = {
        users: [],
        isLoading: true,
        inputSearch: ''
    };

    componentDidMount () {
        APICallManager.getUsers((response) => {
            response.data.map((user, index) => (user.key = index));
            this.setState({
                users: response.data,
                isLoading: false
            });
        });
    }

    handleInputChange (event) {
        event.preventDefault();
        this.setState({ inputSearch: event.target.value });
    }

    render () {
        const isLoading = this.state.isLoading;
        const inputSearch = this.state.inputSearch;
        const users = this.state.users;
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
                            <Link to='/login'>
                                <button>
                                    Log in
                                </button>
                            </Link>
                        }
                    />
                    <Container>
                        <div className='search'>
                            {isLoading
                                ? <Loading/>
                                : users.map(user => (
                                    <UserListItem user={user} key={user.key}/>
                                ))
                            }
                        </div>
                    </Container>
                </div>
        );
    }
}

export default Search;