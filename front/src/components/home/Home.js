import './Home.css';
import React from 'react';
import { Link } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import logo from '../../images/logo.svg'
import Banner from '../banner/Banner';
import Loading from '../loading/Loading';
import Tag from '../tag/Tag';
import Container from '../container/Container';

class Home extends React.Component {

    state = {
        tags: [],
        isLoading: true
    };

    componentDidMount () {
        APICallManager.getTags((response) => {
            console.log(response.data);
            response.data.map((tag, index) => (tag.key = index));
            this.setState({
                tags: response.data,
                isLoading: false
            });

            console.log(this.state.isLoading);
            console.log(this.state.tags);
        });
    }

    render () {
        const isLoading = this.state.isLoading;
        const tags = this.state.tags;
        return (
                <div>
                    <Banner 
                        left={
                            <img src={logo}/>
                        }
                        right = {
                            <Link to="/login">
                                <button>
                                    Log in
                                </button>
                            </Link>
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

export default Home;
