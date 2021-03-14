import './Input.css';
import post from '../../images/post.svg';
import React from 'react';
import PropTypes from 'prop-types';

const InputImage = ({ onFileUpdated }) => {

    const onChange = (event) => {
        const ext = event.target.files[0].name.match(/\.([^.]+)$/)[1];
        switch (ext) {
            case 'jpg':
            case 'jpeg':
            case 'bmp':
            case 'png':
            case 'tif':
                onFileUpdated(event);
                break;
            default:
                alert('File .' + ext + ' is not allowed.');
        }
    }

    return (
        <label className="custom-file-input">
            <input id="imageInput" type="file" accept=".jpg,.jpeg,.bmp,.png,.tif" onChange={(event) => onChange(event)} />
            <img src={post}/> Add image
        </label>
    );
}

InputImage.propTypes = {
    onFileUpdated: PropTypes.func.isRequired
}

export default InputImage;
