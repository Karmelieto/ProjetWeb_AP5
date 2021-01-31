import axios from 'axios';

export default class APICallManager {
    static backUrl = 'http://localhost:4242';

    static getUser (pseudo, callback) : any {
        axios.get(APICallManager.backUrl + '/profile/' + pseudo).then(callback);
    }
};
