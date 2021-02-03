import axios from 'axios';

export default class APICallManager {
    static backUrl = 'http://localhost:4242';

    static getUsers (callback) {
        axios.get(APICallManager.backUrl + '/users').then(callback);
    }

    static getUser (pseudo, callback) {
        axios.get(APICallManager.backUrl + '/users/' + pseudo).then(callback);
    }

    static login (email, pseudo, callback) {
        
    }

    static async register (email, pseudo, password, callback) {
        const msgBuffer = new TextEncoder('utf-8').encode(password);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        password = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
        axios.post(APICallManager.backUrl + '/users/', { email, pseudo, password }).then(callback);
    } 
};
