import axios from 'axios';

export default class APICallManager {
    static backUrl = 'http://localhost:4242';

    static getUsers (callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/users').then(callback).catch(errorCallback);
    }

    static getTags (callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/tags').then(callback).catch(errorCallback);
    }

    static getPublications (callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/publications').then(callback).catch(errorCallback);
    }

    static getUser (pseudo, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/users' + pseudo).then(callback).catch(errorCallback);
    }

    static getTag (nom, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/tags' + nom).then(callback).catch(errorCallback);
    }

    static getPublication (nom, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/publications' + nom).then(callback).catch(errorCallback);
    }

    static login (email, pseudo, callback) {
        
    }

    static async register (email, pseudo, password, callback, errorCallback) {
        const msgBuffer = new TextEncoder('utf-8').encode(password);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        password = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
        axios.post(APICallManager.backUrl + '/users/', { email, pseudo, password }).then(callback).catch(errorCallback);
    } 
};
