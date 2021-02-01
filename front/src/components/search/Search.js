import './Search.css';
import APICallManager from '../../app/APICallManager';
import React from 'react';

class Search extends React.Component {
    componentDidMount () {
        APICallManager.getUser('Toto', (repos) => {
            console.log(repos.data);
        });
    }

    render () {
        return (
                <div className='search'>
                    Search
                </div>
        );
    }
}

export default Search;
