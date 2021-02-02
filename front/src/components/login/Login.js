import './Login.css';
import React from 'react';
import APICallManager from '../../app/APICallManager';
import back from '../../images/back.svg'
import Banner from '../banner/Banner';
import Container from '../container/Container';
import Loading from '../loading/Loading';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class Login extends React.Component {

    state = {
        isLoading: false
    };

    componentDidMount () {
        APICallManager.getUsers((response) => {
            console.log(response.data);
        });
    }

    onBackClicked (event) {
        this.props.history.goBack();
    }

    render () {
        const isLoading = this.state.isLoading;
        return (
                <div>
                    <Banner 
                        left={
                            <img src={back} className='back-img' onClick={ (event) => this.onBackClicked(event) }/>
                        }
                    />
                    <Container>
                        <div className='home'>
                            {isLoading
                                ? <Loading/>
                                : <div>
                                    <input/>
                                </div>
                            }
                        </div>
                    </Container>
                </div>
        );
    }
}

Login.propTypes = {
    history: PropTypes.object
}

export default withRouter(Login);
