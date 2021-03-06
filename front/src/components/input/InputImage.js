import './Input.css';
import post from '../../images/post.svg';
import React from 'react';
import PropTypes from 'prop-types';

const InputImage = ({ onFileUpdated }) => {
    return (
        <label className="custom-file-input">
            <input type="file" onChange={(event) => onFileUpdated(event)} />
            <img src={post}/> Add image
        </label>
    );
}

InputImage.propTypes = {
    onFileUpdated: PropTypes.func.isRequired
}

export default InputImage;
