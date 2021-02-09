import './Search.css';
import React from 'react';
import PropTypes from 'prop-types';

const SearchList = ({ elements, actionOnClick, type }) => {

    function onItemSelected (value) {
        const el = document.getElementById('options');
        el.style.display = 'none';
        el.style.display = '';

        actionOnClick(value);
    }

    return (
        <div id="options" className="dropdown-content transform-for-search limit-height">
            {
                elements.map(el => (
                    <a onClick={ () => onItemSelected(el.name) } key={el.key} >{type} {el.name}</a>
                ))
            }
        </div>
    );
}

SearchList.propTypes = {
    elements: PropTypes.array.isRequired,
    actionOnClick: PropTypes.func.isRequired,
    type: PropTypes.string
}

export default SearchList;
