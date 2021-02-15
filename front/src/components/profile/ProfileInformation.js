import './Profile.css';
import React from 'react';
import reward1 from '../../images/reward_1.svg';
import reward2 from '../../images/reward_2.svg';
import reward3 from '../../images/reward_3.svg';
import PropTypes from 'prop-types';

const ProfileInformation = ({ user }) => {

    const nbRewards = [0, 0, 0];
    user.rewards.map(reward => {
        if (reward.rank < 4) {
            nbRewards[reward.rank - 1] += 1;
        }
        return true;
    });

    return (
        <div className="user-profile">
            <div className="user-datas flex-nowrap">
                <div>
                    <img src={user.profileImageLink}/>
                </div>
                <p>{user.description}</p>
            </div>
            <div className="user-rewards flex-nowrap">
                <div>
                    <img src={reward1}/>
                    <p>{nbRewards[0]}</p>
                </div>
                <div>
                    <img src={reward2}/>
                    <p>{nbRewards[1]}</p>
                </div>
                <div>
                    <img src={reward3}/>
                    <p>{nbRewards[2]}</p>
                </div>
            </div>
        </div>
    );
}

ProfileInformation.propTypes = {
    user: PropTypes.object
}

export default ProfileInformation;
