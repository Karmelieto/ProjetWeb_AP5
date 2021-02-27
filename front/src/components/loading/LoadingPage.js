import './Loading.css';
import React from 'react';

/* CSS FOUND HERE : https://codepen.io/ahmadbassamemran/pen/bXRPdr */

const LoadingPage = () => {
    return (
        <div className="loading">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="shadow"></div>
            <div className="shadow"></div>
            <div className="shadow"></div>
            <span>Loading</span>
        </div>
    );
}

export default LoadingPage;
