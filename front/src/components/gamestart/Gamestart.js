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
            tag: '',
            currentTagName: '',
            isLoading: true,
            isTagLoading: true,
            isImageLoading: true,
            isThereTwoPublications: false,
            isAnimationRunning: false
        };
        this.onPictureSelected = this.onPictureSelected.bind(this);
    }

    componentDidMount () {
        if (!this.props.user) {
            this.props.history.push('/login?comingFrom=play');
            return;
        }
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
        if (this.state.isAnimationRunning) return;
        this.setState({ isAnimationRunning: true });
        const clickedPic = this.state.publications[clickedOn];
        // BEGIN of block = if we want to increase points for voted pic and decrease for the other pic
        let otherPic = 0;
        clickedOn === 1 ? otherPic = 0 : otherPic = 1
        APICallManager.voteForPublication(clickedPic._id, 1)
        APICallManager.voteForPublication(this.state.publications[otherPic]._id, -1)
        // END of block
        // APICallManager.voteForPublication(clickedPic._id, 0);

        const displayPoint = (clickedOn === 0) ? 'left-add' : 'left-remove';
        const displayOtherPoint = (clickedOn === 1) ? 'right-add' : 'right-remove';
        
        const elementPoint = document.getElementById(displayPoint);
        const elementOtherPoint = document.getElementById(displayOtherPoint);

        const anim = elementPoint.animate([
            // keyframes
            { opacity: 0.5, transform: 'scale(0.0)', zIndex: 1 },
            { opacity: 1, transform: 'scale(1)', zIndex: 1 }
        ], {
            // timing options
            duration: 700,
            iterations: 2,
            direction: 'alternate',
            easing: 'ease-in-out'
        });

        anim.onfinish = () => {
            this.getTwoRandomPublications();
            this.setState({ isAnimationRunning: false });
        }

        elementOtherPoint.animate([
            // keyframes
            { opacity: 0.5, transform: 'scale(0.0)', zIndex: 1 },
            { opacity: 1, transform: 'scale(1)', zIndex: 1 }
        ], {
            // timing options
            duration: 700,
            iterations: 2,
            direction: 'alternate',
            easing: 'ease-in-out'
        });
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
                            <div className="column">
                                <img src={this.state.publications[0].imageLink} onClick={ () => this.onPictureSelected(0) }/>
                                <div id="left-remove" className="remove-point point">
                                    -1
                                </div>
                                <div id="left-add" className="add-point point">
                                    +1
                                </div>
                            </div>
                            <div className="column">
                                <img src={this.state.publications[1].imageLink} onClick={ () => this.onPictureSelected(1) }/>
                                <div id="right-remove" className="remove-point point">
                                    -1
                                </div>
                                <div id="right-add" className="add-point point">
                                    +1
                                </div>
                            </div>
                        </div>
                        </div>
                        : <p>Unfortunately, there are not enough publications to play for this tag yet. Publish yours !</p>
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
