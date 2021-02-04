import axios from 'axios';

export default class APICallManager {
    static backUrl = 'http://localhost:4242';

    static getUsers (callback) {
        axios.get(APICallManager.backUrl + '/users').then(callback);
    }

    static getTags (callback) {
        axios.get(APICallManager.backUrl + '/tags').then(callback);
    }

    static getPublications (callback) {
        axios.get(APICallManager.backUrl + '/publications').then(callback);
    }

    static getUser (pseudo, callback) {
        axios.get(APICallManager.backUrl + '/users' + pseudo).then(callback);
    }

    static getTag (nom, callback) {
        axios.get(APICallManager.backUrl + '/tags' + nom).then(callback);
    }

    static getPublication (nom, callback) {
        axios.get(APICallManager.backUrl + '/publications' + nom).then(callback);
    }

    static login (mail, password, callback) {
        
    }

    static async register (mail, pseudo, password, callback) {
        password = await hashPassword(password);
        console.log('PASSWORD : ' + password);
        axios.post(APICallManager.backUrl + '/users/', { mail, pseudo, password }).then(callback);
    } 
};

async function hashPassword (password) {
    const msgBuffer = new TextEncoder('utf-8').encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
}
