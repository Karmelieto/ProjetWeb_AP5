import './Menu.css';
import React from 'react';
import home from '../../images/home.svg';
import search from '../../images/search.svg';
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
        const isGoodLocation = (location !== '/login' && location !== '/register');
        
        return (
            <div>
                { isGoodLocation &&
                    <div className='menu'>
                        <NavLink exact to='/' className='menu-item' activeClassName='selected'><img className='menu-img' src={home}/></NavLink>
                        <NavLink to='/search' className='menu-item' activeClassName='selected'><img className='menu-img' src={search}/></NavLink>
                        <NavLink to='/play' className='menu-item' activeClassName='selected'><img className='menu-img' src={play}/></NavLink>
                        <NavLink to='/publication' className='menu-item' activeClassName='selected'><img className='menu-img' src={publication}/></NavLink>
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
