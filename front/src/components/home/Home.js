import './Home.css';
import React from 'react';
import { Link } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import logo from '../../images/logo.svg'
import Banner from '../banner/Banner';
import Loading from '../loading/Loading';
import Tag from '../tag/Tag';
import Container from '../container/Container';
import PropTypes from 'prop-types';

class Home extends React.Component {

    state = {
        tags: [],
        isLoading: true
    };

    componentDidMount () {
        APICallManager.getTags((response) => {
            response.data.map((tag, index) => (tag.key = index));
            this.setState({
                tags: response.data,
                isLoading: false
            });
        });
    }
    
    render () {
        const isLoading = this.state.isLoading;
        const tags = this.state.tags;
        const user = this.props.user;
        return (
                <div>
                    <Banner 
                        left={
                            <img src={logo}/>
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
                                    : <img className="user-pic" src={user.profileImageLink}/>
                                }
                                
                            </div>
                        }
                    />
                    <Container>
                        <div className='home'>
                            {isLoading
                                ? <Loading/>
                                : tags.map(tag => (
                                    <Tag tag={tag} key={tag.key}/>
                                ))
                            }
                        </div>
                    </Container>
                </div>
        );
    }
}

Home.propTypes = {
    user: PropTypes.object
}

export default Home;
