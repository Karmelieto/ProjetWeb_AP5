import './Gallery.css';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Gallery = ({ publications }) => {

    return (
        <div className="gallery">
            {
                publications.map(publication => (
                    <Link to={'/publication/' + publication._id} key={publication._id}>
                        <img className="gallery-img" src={publication.imageLink} />
                    </Link>
                ))
            }
        </div>
    );
}

Gallery.propTypes = {
    publications: PropTypes.array.isRequired
}

export default Gallery;
