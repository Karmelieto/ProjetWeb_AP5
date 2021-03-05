import './Banner.css';
import React from 'react';
import PropTypes from 'prop-types';

const Banner = (props) => {
    return (
        <div className="banner">
            <div className="banner-left transform-scale">
                {props.left}
            </div>
            <div className="banner-center transform-scale">
                {props.center}
            </div>
            <div className="banner-right transform-scale">
                {props.right}
            </div>
      </div>
    );
}

Banner.propTypes = {
    left: PropTypes.node,
    center: PropTypes.node,
    right: PropTypes.node
}

export default Banner;
