import './Popup.css';
import React from 'react';
import PropTypes from 'prop-types';

const Popup = (props) => {
    return (
        <div className="popup-background">
            <div className="popup">
                <div className="popup-top">
                    {props.title}
                </div>
                <div className="popup-center">
                    {props.center}
                </div>
                <div className="popup-bottom">
                    <button className="button-marble" onClick={props.actionOnCancel}>Cancel</button>
                    <button className="button-marble" onClick={ props.actionOnValidate}>Validate</button>
                </div>
            </div>
        </div>
    );
}

Popup.propTypes = {
    title: PropTypes.string.isRequired,
    center: PropTypes.node,
    actionOnCancel: PropTypes.func,
    actionOnValidate: PropTypes.func
}

export default Popup;
