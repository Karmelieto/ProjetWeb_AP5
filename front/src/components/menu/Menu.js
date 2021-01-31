import './Menu.css';
import React from 'react';
import home from '../../images/home.svg';
import search from '../../images/search.svg';
import play from '../../images/play.svg';
import post from '../../images/post.svg';
import { NavLink } from 'react-router-dom';

function Menu () {
    return (
            <div className='menu'>
                <NavLink exact to='/' className='menu-item' activeClassName='selected'><img className='menu-img' src={home}/></NavLink>
                <NavLink to='/search' className='menu-item' activeClassName='selected'><img className='menu-img' src={search}/></NavLink>
                <NavLink to='/play' className='menu-item' activeClassName='selected'><img className='menu-img' src={play}/></NavLink>
                <NavLink to='/post' className='menu-item' activeClassName='selected'><img className='menu-img' src={post}/></NavLink>
            </div>
    );    
}

export default Menu;
