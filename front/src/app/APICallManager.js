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

    static getAllTagsByIds (ids, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/tags/ids/' + ids.join()).then(callback).catch(errorCallback);
    }

    static getRandomTags (nb, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/tags/random/' + nb).then(callback).catch(errorCallback);
    }

    static getPublications (callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/publications').then(callback).catch(errorCallback);
    }

    static getPublicationsOfUser (pseudo, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/publications/user/' + pseudo).then(callback).catch(errorCallback);
    }

    static getPublicationsByTag (tagId, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/publications/tag/' + tagId).then(callback).catch(errorCallback);
    }

    static getPublicationsByArrayOfId (ids, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/publications/favorites/' + ids.join()).then(callback).catch(errorCallback);
    }

    static getPublication (id, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/publications/' + id).then(callback).catch(errorCallback);
    }

    static getTwoRandomPublications (tag, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/publications/tworandom/' + tag).then(callback).catch(errorCallback);
    }

    static voteForPublication (id, point, callback, errorCallback) {
        axios.put(APICallManager.backUrl + '/publications/vote/' + id + '/' + point).then(callback).catch(errorCallback);
    }

    static getFavoritesOfUser (pseudo, callback, errorCallback) {
        axios.get(APICallManager.backUrl + '/users/favorites/' + pseudo).then(callback).catch(errorCallback);
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
    
    static async createTag (tag, callback, errorCallback) {
        return await axios.post(APICallManager.backUrl + '/tags', tag).then(callback).catch(errorCallback);
    }

    static async createPublication (publication, callback, errorCallback) {
        axios.post(APICallManager.backUrl + '/publications', publication).then(callback).catch(errorCallback);
    }

    static async removePublication (pseudo, token, idPost, callback, errorCallback) {
        axios.delete(APICallManager.backUrl + '/publications/' + idPost, { data: { pseudo: pseudo, token: token } }).then(callback).catch(errorCallback);
    }

    static async updateTagImage (tagId, imageLink, callback, errorCallback) {
        axios.put(APICallManager.backUrl + '/tags', { id: tagId, newImageLink: imageLink }).then(callback).catch(errorCallback);
    }

    static async addPublicationToFavorites (pseudo, idPost, callback, errorCallback) {
        axios.post(APICallManager.backUrl + '/users/favorites', { pseudo: pseudo, idPost: idPost }).then(callback).catch(errorCallback);
    }

    static async removePublicationFromFavorites (pseudo, idPost, callback, errorCallback) {
        axios.delete(APICallManager.backUrl + '/users/favorites', { data: { pseudo: pseudo, idPost: idPost } }).then(callback).catch(errorCallback);
    }
};

async function hashPassword (password) {
    const msgBuffer = new TextEncoder('utf-8').encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
}
