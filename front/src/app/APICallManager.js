import axios from 'axios';

export default class APICallManager {
    static backUrl = 'http://localhost:4242';

    static getUser (pseudo, callback) {
        axios.get(APICallManager.backUrl + '/users/' + pseudo).then(callback);
    }
};
