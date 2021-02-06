import './Navigator.css';
import { Route, Switch } from 'react-router';
import Home from '../home/Home';
import Search from '../search/Search';
import React, { useState } from 'react';
import Login from '../login/Login';
import Register from '../register/Register';

const Navigator = () => {

    const [user, setUser] = useState();
    
    const updateUser = () => {
        console.log('Update');
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
        }
    };

    return (
        <div className='navigator flex-content' >
            <Switch>
                <Route exact path='/'>
                    <Home user={user} />
                </Route>
                <Route path='/search'>
                    <Search user={user} />
                </Route>
                <Route path='/login'>
                    <Login updateUser={updateUser} />
                </Route>
                <Route path='/register'>
                    <Register updateUser={updateUser} />
                </Route>
            </Switch>
        </div>
        );
}

export default Navigator;
