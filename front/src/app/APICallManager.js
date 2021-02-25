import axios from 'axios';

export default class APICallManager {
    static backUrl = 'http://localhost:4242';
    static cloud = 'http://89.158.244.191:17001';

    static getUsers (callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/users').then(callback).catch(errorCallback);
    }

    static getUsersByPseudo (pseudo, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/users/filter/' + pseudo).then(callback).catch(errorCallback);
    }

    static getUser (pseudo, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/users/' + pseudo).then(callback).catch(errorCallback);
    }

    static deleteUser (pseudo, pseudoUserConnected) {
        axios.delete(APICallManager.backUrl + '/users', { data: { pseudo, pseudoUserConnected } });
    }

    static getTags (pseudo, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/tags/' + pseudo).then(callback).catch(errorCallback);
    }

    static getTagsByName (tagName, pseudo, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/tags/filter/' + tagName + '/' + pseudo).then(callback).catch(errorCallback);
    }

    static getPublications (callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/publications').then(callback).catch(errorCallback);
    }

    static getPublicationsOfUser (pseudo, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/publications/user/' + pseudo).then(callback).catch(errorCallback);
    }

    static getPublicationsByTag (tagName, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/publications/tag/' + tagName).then(callback).catch(errorCallback);
    }

    static getPublicationsByArrayOfId (ids, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/publications/favorites/' + ids.join()).then(callback).catch(errorCallback);
    }

    static getPublication (id, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/publications/' + id).then(callback).catch(errorCallback);
    }

    static async login (mail, password, callback, errorCallback) {
        password = await hashPassword(password);
        axios.post(APICallManager.backUrl + '/users/login/', { mail, password }).then(callback).catch(errorCallback);
    }

    static async register (mail, pseudo, password, callback, errorCallback) {
        password = await hashPassword(password);
        axios.post(APICallManager.backUrl + '/users/', { mail, pseudo, password }).then(callback).catch(errorCallback);
    }

    static async uploadImage (token, image, callback, errorCallback) {
        const formData = new FormData();
        formData.append('token', token);
        formData.append('image', image);
        axios.post(APICallManager.cloud + '/images', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
        .then(callback)
        .catch(errorCallback);
    }
};

async function hashPassword (password) {
    const msgBuffer = new TextEncoder('utf-8').encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
}
