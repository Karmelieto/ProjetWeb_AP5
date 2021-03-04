import '../search/Search.css';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import logo from '../../images/logo.svg'
import Banner from '../banner/Banner';
import Loading from '../loading/LoadingPage';
import Container from '../container/Container';
import PropTypes from 'prop-types';
import SearchList from '../search/SearchList';
import Tag from '../tag/Tag';

class GameStart extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            publications: [],
            tags: [],
            tag: '',
            randomTag: '',
            isLoading: true,
            inputSearch: ''
        };
        this.onTagSelected = this.onTagSelected.bind(this);
    }

    componentDidMount () {
        if (!this.props.user) {
            this.props.history.push('/login?comingFrom=play');
            return;
        }
        let pseudo = '';
        if (this.props.user) {
            pseudo = this.props.user.pseudo;
        }
        if (this.props.tag) {
            this.setState({ inputSearch: this.props.tag });
        }
        APICallManager.getTags(pseudo, (response) => {
            this.setState({
                tags: response.data,
                isLoading: false
            });
        });
        this.setState.tag = this.props.tag;
    }

    onTagSelected (clickedOn) {
        this.setState({ inputSearch: clickedOn });
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
        const tag = this.props.tag;
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
                    <div className='gameZone'>
                        <h1>Test {tag.name}</h1>
                        {isLoading
                            ? <Loading />
                            : tags.slice(0, 3).map((tag, index) => (
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
GameStart.PropTypes = {
    hystory: PropTypes.object,
    user: PropTypes.object,
    setTag: PropTypes.func.isRequired
}
export default withRouter(GameStart);
