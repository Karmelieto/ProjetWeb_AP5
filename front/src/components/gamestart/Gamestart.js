import '../search/Search.css';
import './Gamestart.css'
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import logo from '../../images/logo.svg'
import Banner from '../banner/Banner';
import Loading from '../loading/LoadingPage';
import Container from '../container/Container';
import PropTypes from 'prop-types';

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
            isThereTwoPublications: false,
            inputSearch: ''
        };
        this.onPictureSelected = this.onPictureSelected.bind(this);
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
        this.getTwoRandomPublications()
    }

    getTwoRandomPublications () {
        APICallManager.getTwoRandomPublications(this.props.history.location.pathname.split('/')[2], (response) => {
            this.setState({
                publications: response.data,
                isImageLoading: false
            })
            if (this.state.publications[1] != null) {
                this.setState({
                    isThereTwoPublications: true
                })
            }
        })
    }

    onPictureSelected (clickedOn) {
        const clickedPic = this.state.publications[clickedOn]
        // Commented block = if we want to increase points for voted pic and decrease for the other pic
        // let otherPic = 0;
        // clickedOn === 1 ? otherPic = 0 : otherPic = 1
        // APICallManager.voteForPublication(clickedPic._id, 1)
        // APICallManager.voteForPublication(otherPic._id, -1)
        APICallManager.voteForPublication(clickedPic._id, 0);
        this.getTwoRandomPublications();
    }

    handleInputChange (event) {
        event.preventDefault();
        this.setState({ inputSearch: event.target.value });
        this.getTags(event.target.value.trim());
    }

    render () {
        const isTagLoading = this.state.isTagLoading;
        const isImageLoading = this.state.isImageLoading;
        const isThereTwoPublications = this.state.isThereTwoPublications;
        const user = this.props.user;
        return (
            <div>
                <Banner
                    left={
                        <Link to="/"><img src={logo} /></Link>
                    }
                    center={
                        isTagLoading 
                        ? <h1>Tag</h1>
                        : <h1>{this.state.tag.name.capitalize()}</h1>
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
                        {isImageLoading
                        ? <Loading />
                        : isThereTwoPublications
                        ? <div>
                            <h1>Which one is best ?</h1> 
                        <div className="row">
                            <div className="column"><img src={this.state.publications[0].imageLink} onClick={ () => this.onPictureSelected(0) }/></div>
                            <div className="column"><img src={this.state.publications[1].imageLink} onClick={ () => this.onPictureSelected(1) }/></div>
                        </div>
                        </div>
                        : <p>Unfortunately, there are not enough publications for this tag yet. Publish yours !</p>
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
