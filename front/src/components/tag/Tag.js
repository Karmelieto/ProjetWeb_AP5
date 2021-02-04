import './Tag.css';
import React from 'react';
import PropTypes from 'prop-types';

const Tag = (props) => {
    return (
        <div className="tag">
            <div className="tag-name">
                &#x3A6; {props.tag.name}
            </div>
            <div className="tag-img" >
                <img src={props.tag.imageLink}/>
            </div>
      </div>
    );
}

Tag.propTypes = {
    tag: PropTypes.any.isRequired
}

export default Tag;
