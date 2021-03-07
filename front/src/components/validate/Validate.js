import './Validate.css';
import React from 'react';
import validate from '../../images/validate.svg';
import cantValidate from '../../images/cant_validate.svg';
import round from '../../images/round.svg';
import PropTypes from 'prop-types';

const Validate = ({ canBeValidate, onClick }) => {
    return (
        
            <div>
                {
                (canBeValidate)
                ? <div className='validate' onClick={(event) => onClick()}>
                    <img src={round}/>
                    <img className='validate-check' src={validate}/>
                </div>
                : <img src={cantValidate}/>
                }
            </div>
    )
}

Validate.propTypes = {
    onClick: PropTypes.func.isRequired,
    canBeValidate: PropTypes.bool.isRequired
}

export default Validate;
