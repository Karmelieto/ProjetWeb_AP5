import './Navigator.css';
import { Route, Switch } from 'react-router';
import Home from '../home/Home';
import SearchUser from '../search/SearchUser';
import SearchTag from '../search/SearchTag';
import React from 'react';
import Login from '../login/Login';
import Register from '../register/Register';
import Profile from '../profile/Profile';
import MyProfile from '../profile/MyProfile';
import Gamestart from '../gamestart/Gamestart';
import Gameinit from '../gameinit/Gameinit';
import Publication from '../publication/Publication';
import PostPublication from '../postPublication/PostPublication';

class Navigator extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            user: undefined,
            tag: '',
            isReady: false
        }

        this.setUser = this.setUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.clearUser = this.clearUser.bind(this);
        this.setTag = this.setTag.bind(this);
    }

    componentDidMount () {
        this.updateUser();
    }

    setUser (user) {
        this.setState({ user: user, isReady: true });
    }

    updateUser () {
        console.log('Update');
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            this.setUser(foundUser);
        } else {
            this.setUser(undefined);
        }
    }

    clearUser () {
        console.log('Clear');
        localStorage.clear();
        this.setUser(undefined);
    }

    setTag (tag) {
        this.setState({ tag: tag });
    }

    render () {
        if (!this.state.isReady) return null;
        const user = this.state.user;
        const tag = this.state.tag;
        return (
            <div className='navigator flex-content' >
                <Switch>
                    <Route exact path='/'>
                        <Home user={user} setTag={this.setTag} />
                    </Route>
                    <Route path='/search/users'>
                        <SearchUser user={user} />
                    </Route>
                    <Route path='/search/tags'>
                        <SearchTag user={user} tag={tag} />
                    </Route>
                    <Route path='/login'>
                        <Login updateUser={this.updateUser} />
                    </Route>
                    <Route path='/register'>
                        <Register updateUser={this.updateUser} />
                    </Route>
                    <Route path='/publication/post'>
                        <PostPublication user={user} updateUser={this.updateUser} />
                    </Route>
                    <Route exact path={'/profile/' + (user ? user.pseudo : '')}>
                        <MyProfile user={user} clearUser={this.clearUser} />
                    </Route>
                    <Route path='/profile'>
                        {(user && user.isAdmin)
                            ? <MyProfile user={user} clearUser={this.clearUser} />
                            : <Profile user={user} />
                        }
                    </Route>
                    <Route path='/publication'>
                        <Publication user={user}/>
                    </Route>
                    <Route exact path='/play'>
                        <Gameinit user={user}/>
                    </Route>
                    <Route name="gamestart" path='/play/'>
                        <Gamestart user={user}/>
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default Navigator;
