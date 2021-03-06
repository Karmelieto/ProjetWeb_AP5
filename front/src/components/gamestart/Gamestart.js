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
// import Tag from '../tag/Tag';

class GameStart extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            publications: [],
            tags: [],
            tag: '',
            currentTagName: '',
            isLoading: true,
            isTagLoading: true,
            isImageLoading: true,
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
        APICallManager.getTags(pseudo, (response) => {
            this.setState({
                tags: response.data,
                isLoading: false
            });
        });
        APICallManager.getAllTagsByIds([this.props.history.location.pathname.split('/')[2]], (response) => {
            this.setState({
                tag: response.data[0],
                isTagLoading: false
            })
        })
        APICallManager.getTwoRandomPublications(this.props.history.location.pathname.split('/')[2], (response) => {
            this.setState({
                publications: response.data,
                isImageLoading: false
            })
        })
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
        const isTagLoading = this.state.isTagLoading;
        const isImageLoading = this.state.isImageLoading;
        const inputSearch = this.state.inputSearch;
        const tags = this.state.tags;
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
                    <div className='gameZone'>
                        {isTagLoading
                            ? <Loading />
                            : <h1>{this.state.tag.name.capitalize()}</h1>
                        }
                        {isImageLoading
                        ? <Loading />
                        : <div><img src={this.state.publications[0].imageLink}/>
                        <img src={this.state.publications[1].imageLink}/></div>
                    }
                    </div>
                </Container>
            </div>
        );
    }
}
GameStart.propTypes = {
    history: PropTypes.object,
    user: PropTypes.object,
    currentTagName: PropTypes.object
}
export default withRouter(GameStart);
