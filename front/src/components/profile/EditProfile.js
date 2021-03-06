import './Profile.css';
import React from 'react';
import { withRouter } from 'react-router-dom';
import APICallManager from '../../app/APICallManager';
import back from '../../images/back.svg';
import deleteIcon from '../../images/delete.svg'
import Banner from '../banner/Banner';
import LoadingPage from '../loading/LoadingPage';
import LoadingElement from '../loading/LoadingElement';
import Container from '../container/Container';
import Popup from '../popup/Popup';
import PropTypes from 'prop-types';
import Validate from '../validate/Validate';
import InputImage from '../input/InputImage';

class EditProfile extends React.Component {

    constructor (props) {
        super(props);

        this.onValidate = this.onValidate.bind(this);
        this.removePopup = this.removePopup.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);
        this.onFileUpdated = this.onFileUpdated.bind(this);

        this.state = {
            user: null,
            isLoading: true,
            isImageLoading: false,
            isPopupDisplay: false,
            isModificationDoneOnImage: false,
            isModificationDoneOnPseudo: false,
            isModificationDoneOnDescription: false,
            initialDescription: '',
            initialPseudo: ''
        };
    }

    componentDidMount () {
        if (!this.props.user) {
            console.error('CANT FIND USER');
            this.props.history.push('/');
            return;
        }
        const pseudo = this.props.history.location.pathname.split('/')[2];
        APICallManager.getUser(pseudo, (response) => {
            this.setState({ user: response.data, isLoading: false, initialDescription: response.data.description, initialPseudo: response.data.pseudo });
            if (this.props.user.pseudo !== response.data.pseudo && !this.props.user.isAdmin) {
                console.log('USER NOT ALLOWED');
                this.props.history.push('/');
            }
        }, (error) => {
            console.log(error);
            this.props.history.push('/');
        });
    }
    
    onBackClicked () {
        this.props.history.goBack();
    }

    onValidate () {
        if (!this.state.isModificationDoneOnPseudo && !this.state.isModificationDoneOnImage && !this.state.isModificationDoneOnDescription) return;
        APICallManager.updateUser(this.state.initialPseudo, this.state.user, this.props.user.pseudo, (response) => {
            if (this.state.initialPseudo === this.props.user.pseudo) {
                response.data.token = this.props.user.token;
                localStorage.setItem('user', JSON.stringify(response.data));
                this.props.updateUser();
            }
            this.props.history.push('/profile/' + response.data.pseudo);
        }, (error) => {
            console.log(error);
            this.setErrorOnInput('pseudoInput');
        })

    }

    onDeleteClicked () {
        this.setState({ isPopupDisplay: true });
    }

    removePopup () {
        this.setState({ isPopupDisplay: false });
    }

    deleteAccount () {
        if (!this.state.user || !this.props.user) return;
        APICallManager.deleteUser(this.state.user.pseudo, this.props.user.pseudo);
        this.setState({ isPopupDisplay: true });
        if (this.state.user.pseudo === this.props.user.pseudo) this.props.clearUser();
        
        this.props.history.push('/');
    }

    setErrorOnInput (id) {
        const input = document.getElementById(id);
        input.classList.add('input-error');
    }

    removeErrorOnInput (id) {
        const input = document.getElementById(id);
        input.classList.remove('input-error');
    }

    onFileUpdated (event) {
        const file = event.target.files[0];
        this.setState({ isImageLoading: true })
        APICallManager.uploadImage(this.props.user.token, file, (response) => {
            const user = this.state.user;
            user.profileImageLink = response.data;
            this.setState({ user: user, isImageLoading: false, isModificationDoneOnImage: true });
        },
        (error) => {
            console.log(error.response);
        });
    }

    handlePseudoChange (event) {
        event.preventDefault();
        const user = this.state.user;
        user.pseudo = event.target.value;
        this.setState({ user: user, isModificationDoneOnPseudo: (user.pseudo !== this.state.initialPseudo) });
        this.removeErrorOnInput('pseudoInput');
    }

    handleDescriptionChange (event) {
        event.preventDefault();
        const user = this.state.user;
        user.description = event.target.value;
        this.setState({ user: user, isModificationDoneOnDescription: (user.description !== this.state.initialDescription) });
    }

    render () {
        const isLoading = this.state.isLoading;
        const isImageLoading = this.state.isImageLoading;
        const user = this.state.user;
        const isPopupDisplay = this.state.isPopupDisplay;
        return (
                <div>
                    <Banner 
                        left={
                            <img src={back} className="back-img" onClick={ (event) => this.onBackClicked(event) }/>
                        }

                        center= {
                            <div>
                                { !isLoading && <input id="pseudoInput" maxLength="15" value={this.state.user.pseudo} onChange={(event) => this.handlePseudoChange(event)}/> }
                            </div>
                        }

                        right = {
                            <Validate canBeValidate={(this.state.isModificationDoneOnPseudo || this.state.isModificationDoneOnDescription || this.state.isModificationDoneOnImage)} onClick={this.onValidate} />
                        }
                    />
                    <Container>
                        <div>
                            {isLoading
                                ? <LoadingPage/>
                                : <div>
                                    <div className="user-profile">
                                        <div className="user-datas flex-nowrap">
                                            <div>
                                                {
                                                    isImageLoading
                                                    ? <LoadingElement/>
                                                    : <img src={user.profileImageLink}/>
                                                }
                                                <InputImage onFileUpdated={this.onFileUpdated} />
                                            </div>
                                            <textarea className='edit-user-description' value={user.description} onChange={(event) => this.handleDescriptionChange(event)}/>
                                        </div>
                                    </div>
                                    <button className='button-delete-account' onClick={this.onDeleteClicked}>
                                        Delete account 
                                        <img src={deleteIcon}/>
                                    </button>
                                    {
                                        isPopupDisplay &&
                                        <Popup title="Do you really want do delete this account ?" actionOnCancel={this.removePopup} actionOnValidate={this.deleteAccount}
                                            center={ 
                                                <div>
                                                    <img src={user.profileImageLink}/>
                                                    <p>{user.pseudo}</p>
                                                </div> 
                                            }
                                        />
                                    }
                                </div>
                            }
                        </div>
                    </Container>
                </div>
        );
    }
}

EditProfile.propTypes = {
    history: PropTypes.object,
    user: PropTypes.object,
    clearUser: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired
}

export default withRouter(EditProfile);
