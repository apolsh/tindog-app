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

export const addPetReq  = async (petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, city, dogKind, token) => {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return new Promise(async (resolve, reject) => {
        try{
            const response = await server.post('/pets/add', {petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, city, dogKind}, config);
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