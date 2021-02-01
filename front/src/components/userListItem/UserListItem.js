import './UserListItem.css';
import React from 'react';
import PropTypes from 'prop-types';

const UserListItem = (props) => {
    return (
        <div className="user">
            <div className="user-img" >
                <img src={props.user.profileImageLink}/>
            </div>
            <div className="user-name">
                {props.user.pseudo}
            </div>
      </div>
    );
}

UserListItem.propTypes = {
    user: PropTypes.any.isRequired
}

export default UserListItem;
