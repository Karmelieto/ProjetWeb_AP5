import './PostPublication.css';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import logo from '../../images/logo.svg'
import Banner from '../banner/Banner';
import Container from '../container/Container';
import SearchList from '../search/SearchList';
import PropTypes from 'prop-types';

class PostPublication extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            tagsSearch: [],
            tagsPublication: [],
            inputSearch: ''
        };

        this.onTagSelected = this.onTagSelected.bind(this);
    }

    componentDidMount () {
        if (!this.props.user) {
            this.props.history.push('/login?comingFrom=postpublication');
            // return;
        }
    }

    getTags (tagName) {
        
        if (tagName) {
            let pseudo = '';
            if (this.props.user) {
                pseudo = this.props.user.pseudo;
            }
            APICallManager.getTagsByName(tagName, pseudo, (response) => {
                console.log(response.data);
                this.setState({
                    tagsSearch: response.data
                });
            });
        } else {
            this.setState({
                tagsSearch: []
            });
        }
    }

    onTagSelected (clickedOn) {
        const tags = this.state.tagsPublication;
        tags.push(clickedOn);
        this.setState({ tagsPublication: tags, tagsSearch: [], inputSearch: '' });
    }

    handleInputChange (event) {
        event.preventDefault();
        this.setState({ inputSearch: event.target.value });
        this.getTags(event.target.value.trim());
    }

    render () {
        const inputSearch = this.state.inputSearch;
        const tagsSearch = this.state.tagsSearch;
        const user = this.props.user;
        return (
                <div>
                    <Banner 
                        left={
                            <img src={logo}/>
                        }
                        center={
                            <div className="dropdown">
                                <input value={inputSearch} onChange={ event => this.handleInputChange(event)}/>
                                <SearchList elements={tagsSearch} actionOnClick={ this.onTagSelected } type="&#x3A6;"/>
                            </div>
                        }
                        right = {
                            <div>
                                {
                                    user &&
                                    <Link to={'/profile/' + user.pseudo}>
                                        <img className="user-pic" src={user.profileImageLink}/>
                                    </Link>
                                }
                                
                            </div>
                        }
                    />
                    <Container>
                        <div className='postPublication'>

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
