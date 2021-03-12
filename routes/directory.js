const express = require('express');
const router = express.Router();
const axios = require('axios');

let db = require('../database');


router.get('/cities', async (req, res) => {
    try{
        let result = await db.execute("SELECT t.city_id, t.cityName FROM tind.sprCity t");
        const cities = result[0];
        res.json(cities);

    }catch(e){
        res.status(500).json({message: "Неизвестная ошибка"})
    }
})

router.get('/dogKinds', async (req, res) => {
    try{
        let result = await db.execute("SELECT t.sprDogKind_id, t.nameRus, t.kindGroup FROM tind.sprDogKind t");
        const dogKinds = result[0];
        res.json(dogKinds);

    }catch(e){
        res.status(500).json({message: "Неизвестная ошибка"})
    }
})

router.post('/rkfCheck', async (req, res) => {
    const {code, number} = req.body;
    try{
        //asdasd
        const response  = await axios.get(`https://rkf.online/api/requests/commonrequest/dog_registration_information?stamp_number=${number}&stamp_code=${code}`)
        if(response.data && response.data.result && response.data.result.status === 2){
            res.json({isConfirmed: true})
        }else{
            res.json({isConfirmed: false})
        }
    }catch(e){
        console.log(e)
    }
})


module.exports = router;