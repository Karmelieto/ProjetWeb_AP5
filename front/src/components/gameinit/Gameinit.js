import './Gameinit.css';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import logo from '../../images/logo.svg'
import Banner from '../banner/Banner';
import LoadingPage from '../loading/LoadingPage';
import Container from '../container/Container';
import PropTypes from 'prop-types';
// import SearchList from '../search/SearchList';
import Tag from '../tag/Tag';

class Gameinit extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            publications: [],
            tags: [],
            randomTag: [],
            isLoading: true,
            isLoadingRandom: true,
            inputSearch: ''
        };
        this.onTagSelected = this.onTagSelected.bind(this);
    }

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
        APICallManager.getRandomTags(1, (response) => {
            this.setState({
                randomTag: response.data,
                isLoadingRandom: false
            });
        });
    }

    getTags (tagName) {
        let pseudo = '';
            if (this.props.user) {
                pseudo = this.props.user.pseudo;
            }
        if (tagName) {
            APICallManager.getTagsByName(tagName, pseudo, (response) => {
                response.data.map((tag, index) => (tag.key = index));
                this.setState({
                    tags: response.data
                });
            });
        } else {
            APICallManager.getTags(pseudo, (response) => {
                this.setState({
                    tags: response.data
                });
            });
        }
    }

    onTagSelected (clickedOn) {
        this.setState({ inputSearch: clickedOn.name });
    }

    handleInputChange (event) {
        event.preventDefault();
        this.setState({ inputSearch: event.target.value });
        this.getTags(event.target.value.trim());
    }

    render () {
        const isLoading = this.state.isLoading;
        const isLoadingRandom = this.state.isLoadingRandom;
        const inputSearch = this.state.inputSearch;
        const tags = this.state.tags;
        const randomTag = this.state.randomTag;
        const user = this.props.user;
        return (
            <div>
                <Banner
                    left={
                        <Link to="/"><img src={logo} /></Link>
                    }
                    center={
                        <div className="dropdown">
                            <input value={inputSearch} onChange={event => this.handleInputChange(event)} />
                            {/* <SearchList elements={tags} actionOnClick={this.onTagSelected} type="&#x3A6;" /> */}
                        </div>
                    }
                    right={
                        <div>
                            {
                                !user
                                    ? <Link to="/login">
                                        <button className="button-marble">
                                            Log in
                                        </button>
                                    </Link>
                                    : <Link to={'/profile/' + user.pseudo}>
                                        <img className="user-pic" src={user.profileImageLink} />
                                    </Link>
                            }

                        </div>
                    }
                />
                <Container>
                    <div className='trendingTags'>
                        <h1>Trending Tags</h1>
                        {isLoading
                            ? <LoadingPage />
                            : <div className='trendings-tags'>
                                {
                                    tags.map((tag, index) => (
                                        <Link to={`/play/${tag._id}`} className="clear-link-decoration" key={index}>
                                            <Tag tag={tag}/>
                                        </Link>
                                    ))
                                }
                            </div>
                        }
                    </div>
                    <div className="randomTag">
                        <h1>Random tag</h1>
                        {isLoadingRandom
                            ? <LoadingPage />
                            : randomTag.slice(0, 1).map((tag, index) => (
                                <Link to={`/play/${tag._id}`} className="clear-link-decoration" key={index}>
                                    <Tag tag={tag}/>
                                </Link>
                            ))
                        }
                    </div>
                </Container>
            </div>
        );
    }
}
Gameinit.propTypes = {
    hystory: PropTypes.object,
    user: PropTypes.object
}
export default withRouter(Gameinit);
