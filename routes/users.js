var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth.middleware')

let db = require('../database');

router.get('/profile', auth, async (req, res) => {
  try{
    let result = await db.execute("SELECT t.userName, t.email, t.phone, t.birthDate FROM tind.user t WHERE t.user_id=?", [req.user.userId])
    const dbUser = result[0][0];
    res.json(dbUser);

  }catch(e){
    res.status(500).json({message: "Неизвестная ошибка"})
  }
})

module.exports = router;
