import './Search.css';
import React from 'react';
import PropTypes from 'prop-types';

const SearchList = ({ elements, inputSearch, placeholder, actionOnClick, actionOnInputChange, type }) => {
    return (
        <div className="dropdown">
            <input id='inputTags' className='input-large' placeholder={ placeholder } value={inputSearch} onChange={ event => actionOnInputChange(event) }/>
            <div id="options" className="dropdown-content limit-size">
                {
                    elements.map((el, index) => (
                        <a onClick={ () => actionOnClick(el) } key={index} >{type} {(type === 'Φ') ? el.name : el.pseudo} <img src={(type === 'Φ') ? el.imageLink : el.profileImageLink}/></a>
                    ))
                }
            </div>
        </div>
    );
}

SearchList.propTypes = {
    elements: PropTypes.array.isRequired,
    inputSearch: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    actionOnClick: PropTypes.func.isRequired,
    actionOnInputChange: PropTypes.func.isRequired,
    type: PropTypes.string
}

export default SearchList;
