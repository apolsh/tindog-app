const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

let db = require('../database');

router.post('/add', auth, async (req, res) => {
    const {
        petName,
        isFemine,
        petBirthDate,
        codeKleimo,
        numberKleimo,
        rod_isConfirmed,
        petClub,
        city,
        dogKind
    } = req.body;
    const userId = req.user.userId;
    const birthDateParsed = new Date(Date.parse(petBirthDate))
    const rod_isConfirmedToInt = rod_isConfirmed ? 1 : 0;

    try {
        let result = await db.execute("INSERT INTO tind.petProfile (user_id, petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, pet_isActive, petCity_id, dogKind_id) " +
            "VALUES (?,?,?,?,?,?,?,?,?,?,?)", [userId, petName, isFemine, birthDateParsed, codeKleimo, numberKleimo, rod_isConfirmedToInt, petClub, 1, city, dogKind]);
        res.status(201).json({message: 'success'})
    } catch (e) {
        console.log(e);
    }
})

router.get('/ofUser', auth, async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await db.execute("SELECT t.petName, t.isFemine, t.petBirthDate, t.codeKleimo, t.numberKleimo, t.rod_isConfirmed, t.petClub, t.pet_isActive, t.petCity_id, t.dogKind_id FROM tind.petProfile t WHERE t.user_id=?", [userId])
        const userPets = result[0];
        res.json(userPets);

    } catch (e) {
        res.status(500).json({message: "Неизвестная ошибка"})
    }
})

module.exports = router;