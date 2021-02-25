import './PostPublication.css';
import React from 'react';
import { withRouter } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import back from '../../images/back.svg';
import cross from '../../images/cross.svg';
import post from '../../images/post.svg';
import Banner from '../banner/Banner';
import Container from '../container/Container';
import SearchList from '../search/SearchList';
import Validate from '../validate/Validate';
import PropTypes from 'prop-types';

class PostPublication extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            tagsSearch: [],
            usersSearch: [],
            publication: {
                tags: [],
                imageLink: 'http://89.158.244.191:17001/images/default.svg',
                pseudo: '',
                description: 'What a beautiful description !'
            },
            usersAllow: [],
            tagSearch: '',
            userSearch: '',
            isTagsSearchUpdated: false,
            isTagAddedIsPrivate: false
        };

        this.timerInput = null;
        this.onTagSelected = this.onTagSelected.bind(this);
        this.onUserSelected = this.onUserSelected.bind(this);
        this.onValidate = this.onValidate.bind(this);
        this.onFileUpdated = this.onFileUpdated.bind(this);
    }

    componentDidMount () {
        if (!this.props.user) {
            this.props.history.push('/login?comingFrom=postpublication');
            return;
        }
        this.onUserSelected({ pseudo: this.props.user.pseudo });
    }

    getTags (tagName) {
        
        if (tagName) {
            let pseudo = '';
            if (this.props.user) {
                pseudo = this.props.user.pseudo;
            }
            APICallManager.getTagsByName(tagName, pseudo, (response) => {
                this.setState({
                    tagsSearch: response.data,
                    isTagsSearchUpdated: true
                });
            });
        } else {
            this.setState({
                tagsSearch: [],
                isTagsSearchUpdated: true
            });
        }
    }

    getUsers (userName) {
        if (userName) {
            APICallManager.getUsersByPseudo(userName, (response) => {
                this.setState({
                    usersSearch: response.data
                });
            });
        } else {
            this.setState({
                usersSearch: []
            });
        }
    }

    onBackClicked (event) {
        this.props.history.goBack();
    }

    onValidate () {
        const tags = this.state.publication.tags.map(tag => tag);
        const publication = this.state.publication;
        if (!publication.tags || !this.state.usersAllow) return;

        publication.tags.forEach(tag => {
            if (tag.isPrivate) {
                tag.usersAllow = this.state.usersAllow;
                tag.imageLink = '';
                APICallManager.createTag(tag);
            } 
        })

        publication.tags = publication.tags.map(tag => tag.name);
        console.log(publication.tags);
        publication.pseudo = this.props.user.pseudo;
        APICallManager.createPublication(publication, (response) => {
            console.log(tags);
            const maxPrivate = this.getNbPrivateTags(tags);
            let nbPrivate = 0;
            tags.forEach(tag => {
                if (tag.isPrivate) {
                    APICallManager.updateTagImage(tag.name, response.data.imageLink, () => {
                        nbPrivate++;
                        if (maxPrivate === nbPrivate) {
                            this.props.history.push('/login/' + this.props.user.pseudo);
                        }
                    });
                }
            })
        })
    }

    onTagSelected (clickedOn) {
        const publication = this.state.publication;
        if (!this.isTagAlreadyAdded(publication.tags, clickedOn)) {
            publication.tags.push(clickedOn);
            this.setState({ publication: publication, tagsSearch: [], tagSearch: '', isTagAddedIsPrivate: this.isTagsArePrivate(publication.tags) });
        }
    }

    getNbPrivateTags (tags) {
        let nb = 0;
        tags.forEach(tag => {
            if (tag.isPrivate) nb++;
        });
        return nb;
    }

    isTagAlreadyAdded (tags, tag) {
        let isAlreadyAdded = false;
        tags.forEach(el => {
            if (el.name === tag.name) isAlreadyAdded = true;
        })
        return isAlreadyAdded;
    }

    onTagDeleted (tag) {
        const publication = this.state.publication;
        const index = publication.tags.indexOf(tag);
        if (index !== -1) {
            publication.tags.splice(index, 1);
            this.setState({ publication: publication, isTagAddedIsPrivate: this.isTagsArePrivate(publication.tags) });
        }
    }

    isTagsArePrivate (tags) {
        let isPrivate = false
        tags.forEach(tag => {
            if (tag.isPrivate) {
                isPrivate = true;
            }
        });
        return isPrivate;
    }

    onFileUpdated (event) {
        const file = event.target.files[0];
        console.log(file);
        APICallManager.uploadImage(this.props.user.token, file, (response) => {
            const publication = this.state.publication;
            publication.imageLink = response.data;
            this.setState({ publication: publication });
        },
        (error) => {
            console.log(error.response);
        });
    }

    onUserSelected (clickedOn) {
        const usersAllow = this.state.usersAllow;
        if (!usersAllow.includes(clickedOn.pseudo)) {
            usersAllow.push(clickedOn.pseudo);
        }
        this.setState({ usersAllow: usersAllow, usersSearch: [], userSearch: '' });
    }

    onUserDeleted (userName) {
        if (userName === this.props.user.pseudo) return;
        const usersAllow = this.state.usersAllow;
        const index = usersAllow.indexOf(userName);
        if (index !== -1) {
            usersAllow.splice(index, 1);
            this.setState({ usersAllow: usersAllow });
        }
    }

    handleTagInputChange (event) {
        event.preventDefault();
        this.setState({ tagSearch: event.target.value, isTagsSearchUpdated: false });
        clearTimeout(this.timerInput);
        this.timerInput = setTimeout(() => {
            this.getTags(event.target.value.trim());
        }, 300);
    }

    handleUserInputChange (event) {
        event.preventDefault();
        this.setState({ userSearch: event.target.value });
        clearTimeout(this.timerInput);
        this.timerInput = setTimeout(() => {
            this.getUsers(event.target.value.trim());
        }, 300);
    }

    handleDescriptionChange (event) {
        event.preventDefault();
        const publication = this.state.publication;
        publication.description = event.target.value;
        this.setState({ publication: publication });
    }

    render () {
        const tagSearch = this.state.tagSearch;
        const tagsSearch = this.state.tagsSearch;
        const userSearch = this.state.userSearch;
        const usersSearch = this.state.usersSearch;
        const isTagsSearchUpdated = this.state.isTagsSearchUpdated;
        const isTagAddedIsPrivate = this.state.isTagAddedIsPrivate;
        if (isTagsSearchUpdated && tagSearch.trim() !== '' && !tagsSearch.find(tag => { return (tag.name === tagSearch) })) tagsSearch.push({ name: tagSearch, isPrivate: true });
        const publication = this.state.publication;
        const usersAllow = this.state.usersAllow;
        return (
                <div>
                    <Banner 
                        left={
                            <img src={back} className="back-img" onClick={ (event) => this.onBackClicked(event) }/>
                        }
                        center={
                            <div className="dropdown">
                                <input placeholder="Tags related" className="input-large" value={tagSearch} onChange={ event => this.handleTagInputChange(event)}/>
                                <SearchList elements={tagsSearch} actionOnClick={ this.onTagSelected } type="&#x3A6;"/>
                            </div>
                        }
                        right = {
                            <div>
                            {
                                publication.tags.length > 0 && ((isTagAddedIsPrivate && usersAllow.length > 0) || !isTagAddedIsPrivate) &&
                                <Validate onClick={this.onValidate}/>
                            }
                            </div>
                        }
                    />
                    <Container>
                        <div className='post-publication'>
                            <div className='publication-select'>
                                <img src={publication.imageLink}/>
                                <label className="custom-file-input">
                                    <input type="file" onChange={this.onFileUpdated} />
                                    <img src={post}/> Add image
                                </label>
                            </div>
                            <div className='publication-tags'>
                                {
                                    publication.tags.map((tag, index) => (
                                        <div className='publication-tag' style={{ borderColor: (tag.isPrivate) ? 'var(--color-primary-dark)' : 'var(--color-black)' }} key={index} onClick={() => this.onTagDeleted(tag)}>
                                            <label>&#x3A6; {tag.name}</label>
                                            <img className='delete-tag' src={cross}/>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className='publication-description'>
                                <textarea value={publication.description} onChange={(event) => this.handleDescriptionChange(event)}/>
                            </div>
                            {
                                isTagAddedIsPrivate &&
                                <div className='publication-is-private'>
                                    <div className="dropdown">
                                        <input placeholder="Users allowed" className="input-large" value={userSearch} onChange={ event => this.handleUserInputChange(event)}/>
                                        <SearchList elements={usersSearch} actionOnClick={ this.onUserSelected } type=""/>
                                    </div>
                                    <div className='publication-tags'>
                                        {
                                            usersAllow.map((user, index) => (
                                                <div className='publication-tag' key={index} onClick={() => this.onUserDeleted(user)}>
                                                    <label>{user}</label>
                                                    <img className='delete-tag' src={cross}/>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </Container>
                </div>
        );
    }
}

PostPublication.propTypes = {
    user: PropTypes.object,
    history: PropTypes.object.isRequired
}

export default withRouter(PostPublication);
