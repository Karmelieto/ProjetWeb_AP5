import '../search/Search.css';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import logo from '../../images/logo.svg'
import Banner from '../banner/Banner';
import Loading from '../loading/Loading';
import Container from '../container/Container';
import PropTypes from 'prop-types';
import SearchList from '../search/SearchList';
import Tag from '../tag/Tag';

class Gameinit extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            publications: [],
            tags: [],
            randomTag: '',
            isLoading: true,
            inputSearch: ''
        };
        this.onTagSelected = this.onTagSelected.bind(this);
    }

    componentDidMount () {
        let pseudo = '';
        if (this.props.user) {
            pseudo = this.props.user.pseudo;
        }
        if (this.props.tag) {
            this.setState({ inputSearch: this.props.tag });
            this.getPublications(this.props.tag);
        }
        APICallManager.getTags(pseudo, (response) => {
            this.setState({
                tags: response.data,
                isLoading: false
            });
        });
    }

    getTags (tagName) {
        if (tagName) {
            let pseudo = '';
            if (this.props.user) {
                pseudo = this.props.user.pseudo;
            }
            APICallManager.getTagsByName(tagName, pseudo, (response) => {
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
        this.setState({ inputSearch: clickedOn });
        this.getPublications(clickedOn);
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
        // const randomTag = this.randomTag;
        const user = this.props.user;
        return (
            <div>
                <Banner
                    left={
                        <Link to="/"><img src={logo} /></Link>
                    }
                    center={
                        <div className="input-button dropdown">
                            <input value={inputSearch} onChange={event => this.handleInputChange(event)} />
                            <SearchList elements={tags} actionOnClick={this.onTagSelected} type="&#x3A6;" />
                            <button className="button-marble">
                                &#x3A6;
                            </button>
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
                    <div className='favoritesTags'>
                        <h1>Favorites Tags</h1>
                        {isLoading
                            ? <Loading />
                            : tags.slice(0, 3).map((tag, index) => (
                                <Link to={`/play/${tag.name}`} className="clear-link-decoration" key={index} onClick={ () => this.props.setTag(tag.name) }>
                                    <Tag tag={tag}/>
                                </Link>
                            ))
                        }
                    </div>
                    <div className="randomTag">
                        <h1>Random tag</h1>
                        {isLoading
                            ? <Loading />
                            : tags.slice(0, 1).map((tag, index) => (
                                <Link to={`/play/${tag.name}`} className="clear-link-decoration" key={index} onClick={ () => this.props.setTag(tag.name) }>
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
Gameinit.PropTypes = {
    hystory: PropTypes.object,
    user: PropTypes.object,
    setTag: PropTypes.func.isRequired
}
export default withRouter(Gameinit);
