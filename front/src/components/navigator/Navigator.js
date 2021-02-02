import './Navigator.css';
import { Route, Switch } from 'react-router';
import Home from '../home/Home';
import Search from '../search/Search';
import React from 'react';
import Login from '../login/Login';

const Navigator = () => {
    return (
        <div className='navigator'>
            <Switch>
                <Route exact path='/'>
                    <Home />
                </Route>
                <Route path='/search'>
                    <Search />
                </Route>
                <Route path='/login'>
                    <Login />
                </Route>
            </Switch>
        </div>
        );
}

export default Navigator;
