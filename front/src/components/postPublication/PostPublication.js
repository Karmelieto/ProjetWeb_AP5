import './PostPublication.css';
import React from 'react';
import { withRouter } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import back from '../../images/back.svg';
import cross from '../../images/cross.svg';
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
            publication: {
                tags: [],
                imageLink: 'http://localhost:4242/images/default.svg',
                pseudo: '',
                description: ''
            },
            inputSearch: '',
            isTagsSearchUpdated: false
        };

        this.timerInput = null;
        this.onTagSelected = this.onTagSelected.bind(this);
        this.onValidate = this.onValidate.bind(this);
    }

    componentDidMount () {
        if (!this.props.user) {
            this.props.history.push('/login?comingFrom=postpublication');
        }
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
                    inputSearch: tagName,
                    isTagsSearchUpdated: true
                });
            });
        } else {
            this.setState({
                tagsSearch: [],
                inputSearch: tagName,
                isTagsSearchUpdated: true
            });
        }
    }

    onTagSelected (clickedOn) {
        const publication = this.state.publication;
        if (!publication.tags.includes(clickedOn)) {
            publication.tags.push(clickedOn);
        }
        this.setState({ publication: publication, tagsSearch: [], inputSearch: '' });
    }

    onBackClicked (event) {
        this.props.history.goBack();
    }

    onValidate () {

    }

    onTagDeleted (tag) {
        const publication = this.state.publication;
        const index = publication.tags.indexOf(tag);
        if (index !== -1) {
            publication.tags.splice(index, 1);
            this.setState({ publication: publication, tagsSearch: [], inputSearch: '' });
        }
    }

    handleInputChange (event) {
        event.preventDefault();
        this.setState({ inputSearch: event.target.value, isTagsSearchUpdated: false });
        clearTimeout(this.timerInput);
        this.timerInput = setTimeout(() => {
            this.getTags(event.target.value.trim());
        }, 300);
    }

    render () {
        const inputSearch = this.state.inputSearch;
        const tagsSearch = this.state.tagsSearch;
        const isTagsSearchUpdated = this.state.isTagsSearchUpdated;
        if (isTagsSearchUpdated && inputSearch.trim() !== '' && !tagsSearch.find(tag => { return (tag.name === inputSearch) })) tagsSearch.push({ name: inputSearch });
        const publication = this.state.publication;
        return (
                <div>
                    <Banner 
                        left={
                            <img src={back} className="back-img" onClick={ (event) => this.onBackClicked(event) }/>
                        }
                        center={
                            <div className="dropdown">
                                <input value={inputSearch} onChange={ event => this.handleInputChange(event)}/>
                                <SearchList elements={tagsSearch} actionOnClick={ this.onTagSelected } type="&#x3A6;"/>
                            </div>
                        }
                        right = {
                            <Validate onClick={this.onValidate}/>
                        }
                    />
                    <Container>
                        <div className='post-publication'>
                            <div className='publication-select'>
                                <img src={publication.imageLink}/>
                                <input type='file'/>
                            </div>
                            <div className='publication-tags'>
                                {
                                    publication.tags.map((tag, index) => (
                                        <div className='publication-tag' key={index} onClick={() => this.onTagDeleted(tag)}>
                                            &#x3A6; {tag}
                                            <img className='delete-tag' src={cross}/>
                                        </div>
                                    ))
                                }
                            </div>
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
