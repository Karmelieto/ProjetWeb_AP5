import './Validate.css';
import React from 'react';
import validate from '../../images/validate.svg';
import round from '../../images/round.svg';
import PropTypes from 'prop-types';

const Validate = ({ onClick }) => {
    return (
        <div className='validate' onClick={(event) => onClick()}>
            <img src={round}/>
            <img className='validate-check' src={validate}/>
        </div>
    )
}

Validate.propTypes = {
    onClick: PropTypes.func.isRequired
}

export default Validate;
