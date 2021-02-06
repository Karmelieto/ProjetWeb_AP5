import './Navigator.css';
import { Route, Switch } from 'react-router';
import Home from '../home/Home';
import Search from '../search/Search';
import React, { useState, useEffect } from 'react';
import Login from '../login/Login';
import Register from '../register/Register';
import Profile from '../profile/Profile';
import MyProfile from '../profile/MyProfile';

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

    useEffect(updateUser, []);

    const clearUser = () => {
        console.log('Clear');
        localStorage.clear();
        setUser(undefined);
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
                <Route exact path={'/profile/' + (user ? user.pseudo : '') }>
                    <MyProfile user={user} clearUser={clearUser} />
                </Route>
                <Route path='/profile'>
                    <Profile user={user}/>
                </Route>
            </Switch>
        </div>
        );
}

export default Navigator;
