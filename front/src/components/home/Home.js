import './Home.css';
import React from 'react';
import { Link } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import logo from '../../images/logo.svg'
import Banner from '../banner/Banner';
import LoadingPage from '../loading/LoadingPage';
import Tag from '../tag/Tag';
import Container from '../container/Container';
import PropTypes from 'prop-types';

class Home extends React.Component {

    state = {
        tags: [],
        isLoading: true
    };

    componentDidMount () {
        let pseudo = '';
        if (this.props.user) {
            pseudo = this.props.user.pseudo;
        }
        APICallManager.getTags(pseudo, (response) => {
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
                        center={
                            <h1>TΦPPICS</h1>
                        }
                        right = {
                            <div>
                                {
                                    !user
                                    ? <Link to="/login?comingFrom=home">
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
                        <div>
                            <h1>Browse tags</h1>
                            {isLoading
                                ? <LoadingPage/>
                                : tags.map((tag, index) => (
                                        <Link to="/search/tags" className="clear-link-decoration" key={index} onClick={ () => this.props.setTag(tag._id) }>
                                            <Tag tag={tag}/>
                                        </Link>
                                    )
                                )
                            }
                        </div>
                    </Container>
                </div>
        );
    }
}

Home.propTypes = {
    user: PropTypes.object,
    setTag: PropTypes.func.isRequired
}

export default Home;
