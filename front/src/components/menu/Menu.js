import './Menu.css';
import React from 'react';
import home from '../../images/home.svg';
import search from '../../images/search.svg';
import user from '../../images/user.svg';
import phi from '../../images/phi.svg';
import play from '../../images/play.svg';
import publication from '../../images/post.svg';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class Menu extends React.Component {

    state = {
        location: ''
    }
    
    componentDidMount () {
        this.setState({ location: window.location.pathname });
        this.props.history.listen((location) => {
            this.setState({ location: location.pathname });
        });
    }

    render () {
        const location = this.state.location;
        const isGoodLocation = (location !== '/login' && location !== '/register' && location !== '/publication/post');
        
        return (
            <div className="flex-footer">
                { isGoodLocation &&
                    <div className='menu'>
                        <NavLink exact to='/' className='menu-item' activeClassName='selected'><img className='menu-img' src={home}/></NavLink>
                        <div className='menu-item menu-search'>
                            <img className='menu-img' src={search}/>
                            <div className='menu-search-dropup'>
                                <NavLink to='/search/users' className='menu-search-dropup-item' activeClassName='selected'><img src={user}/></NavLink>
                                <NavLink to='/search/tags' className='menu-search-dropup-item' activeClassName='selected'><img src={phi}/></NavLink>
                            </div>
                        </div>
                        <NavLink to='/play' className='menu-item' activeClassName='selected'><img className='menu-img' src={play}/></NavLink>
                        <NavLink to='/publication/post' className='menu-item' activeClassName='selected'><img className='menu-img' src={publication}/></NavLink>
                    </div>
                }
            </div>
        );    
    }
    
}

Menu.propTypes = {
    history: PropTypes.object
}

export default withRouter(Menu);
