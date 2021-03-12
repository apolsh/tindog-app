const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const JWT_SECRET = config.get('jwtSecret');


let db = require('../database');


//user registration
router.post('/register', async (req, res) => {
    const {email, password, username, phone, birthday} = req.body;

    const birthdateParsed = new Date(Date.parse(birthday))

    try{
        let check = await db.execute("SELECT t.user_id, t.email, t.pass FROM tind.user t WHERE t.email=?", [email])
        if(check.length > 0 && check[0].length > 1){
            res.status(400).json({message:'Пользователь с указанной электронной почтой уже существует'})
        }else{
            const hashedPassword = await bcrypt.hash(password, 12);

            let result = await db.execute("INSERT INTO tind.user (pass, email, user_isConfirmed, userName, phone, birthDate) " +
                "VALUES (?,?,?,?,?,?)",[hashedPassword, email, 1, username, phone, birthdateParsed] );
            res.status(201).json({message: 'success'})
        }
    }catch(e){
        console.log(e);
    }
})

//user login
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try{
        let result = await db.execute("SELECT t.user_id, t.email, t.pass FROM tind.user t WHERE t.email=?", [email])
        if(result.length > 0 && result[0].length > 0){
            if(result[0].length > 1){
                res.status(500).json({message: `Более чем один пользователь использует почту: ${email}`})
            }else{
                const dbUser = result[0][0]
                const isMatch = await bcrypt.compare(password, dbUser.pass)

                if(!isMatch){
                    res.status(400).json({message:'Неверный пароль'})
                }

                const token = jwt.sign(
                    {userId: dbUser.user_id}, JWT_SECRET, {expiresIn: '1h'}
                )
                res.json({userId: dbUser.user_id , token})
            }
        }else{
            res.status(400).json({message: "Пользователь не найден"})
        }
        console.log(result);
    }catch (e){
        console.log(e);
    }


})

module.exports = router;