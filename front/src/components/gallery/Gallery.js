import './Gallery.css';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import reward1 from '../../images/reward_1.svg';
import reward2 from '../../images/reward_2.svg';
import reward3 from '../../images/reward_3.svg';

const Gallery = ({ publications }) => {
    return (
        <div className="gallery">
            {
                publications.map(publication => (
                    <Link to={'/publication/' + publication._id} key={publication._id} className="gallery-container">
                        <img className="gallery-img" src={publication.imageLink}/>
                        {   
                            publication.rank < 4 && publication.rank !== 0 &&
                            <img className="reward-img" src={(publication.rank === 1 ? reward1 : (publication.rank === 2 ? reward2 : reward3))}/>
                        }
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
