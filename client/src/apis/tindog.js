import axios from "axios";

const server = axios.create({
    baseURL: 'http://localhost:5000/'
})

export const loginReq = async (email, password) => {
    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.post('/auth/login', {email, password});
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }

    })
}

export const registerReq = async (username, email, phone, birthday, password) => {
    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.post('/auth/register', {username, email, phone, birthday, password});
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }

    })
}

export const userInfoReq = async (token) => {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.get('/users/profile', config);
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }

    })
}

export const citiesDirReq = async () => {
    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.get('/directory/cities');
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }
    })
}

export const dogKindsDirReq = async () => {
    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.get('/directory/dogKinds');
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }
    })
}

export const rkfCheckReq = async (code, number) => {
    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.post(`/directory/rkfCheck`,{code, number});
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }
    })
}

export const addPetReq  = async (petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, city, dogKind, avatar, token) => {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    let formData = new FormData();
    formData.append('petName', petName);
    formData.append('isFemine', isFemine);
    formData.append('petBirthDate', petBirthDate);
    formData.append('codeKleimo',codeKleimo);
    formData.append('numberKleimo',numberKleimo);
    formData.append('rod_isConfirmed',rod_isConfirmed);
    formData.append('petClub',petClub);
    formData.append('city',city);
    formData.append('dogKind', dogKind);
    formData.append('avatar',avatar);


    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.post('/pets/add', formData, config);
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }

    })
}

export const getUserPetsReq = async (token) => {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.get('/pets/ofUser', config);
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }

    })
}

export const searchCandidatesReq = async (pet_id, token) => {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.get(`/pets/searchCandidates?pet_id=${pet_id}`, config);
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }

    })
}

export const addLike = async (likeSenderId, likeRecieverId, token) => {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.post(`/pets/likes`,{likeSenderId, likeRecieverId}, config);
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }
    })
}

export const addDisLike = async (disLikeSenderId, disLikeRecieverId, token) => {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.post(`/pets/dislikes`,{disLikeSenderId, disLikeRecieverId}, config);
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }
    })
}

export const getLikesReq = async (pet_id, token) => {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.get(`/pets/likes?pet_id=${pet_id}`, config);
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }

    })
}

export const getMatchesReq = async (pet_id, token) => {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.get(`/pets/matches?pet_id=${pet_id}`, config);
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }

    })
}

export const getChatsReq = async (pet_id, token) => {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.get(`/pets/chats?pet_id=${pet_id}`, config);
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }

    })
}

export const getChatLinesReq = async (chat_id, token) => {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.get(`/pets/chatLinesByChatId?chat_id=${chat_id}`, config);
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }

    })
}

export const sendChatMessageByChatId = async (chatID, myPetId, myMessage, token) => {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.post(`/pets/chatLinesByChatId`,{chatID, myPetId, myMessage}, config);
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }
    })
}

export const getChatIdReq = async (pet_id1, pet_id2, token) => {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.get(`/pets/chatLinesByPetsId?pet_id1=${pet_id1}&pet_id2=${pet_id2}`, config);
            resolve(response.data);
        }catch(e){
            reject(e.response.data);
        }

    })
}