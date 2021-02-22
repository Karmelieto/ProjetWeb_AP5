import './Navigator.css';
import { Route, Switch } from 'react-router';
import Home from '../home/Home';
import SearchUser from '../search/SearchUser';
import SearchTag from '../search/SearchTag';
import React, { useState, useEffect } from 'react';
import Login from '../login/Login';
import Register from '../register/Register';
import Profile from '../profile/Profile';
import MyProfile from '../profile/MyProfile';

const Navigator = () => {

    const [user, setUser] = useState();
    const [tag, setTag] = useState('');
    
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
                    <Home user={user} setTag={setTag} />
                </Route>
                <Route path='/search/users'>
                    <SearchUser user={user} setTag={setTag} />
                </Route>
                <Route path='/search/tags'>
                    <SearchTag user={user} tag={tag} />
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
                    { (user && user.isAdmin)
                        ? <MyProfile user={user} clearUser={clearUser} />
                        : <Profile user={user}/>
                    }
                </Route>

            </Switch>
        </div>
        );
}

export default Navigator;
