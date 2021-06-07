const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
const fs = require("fs");
var path = require('path')

let db = require('../database');

router.post('/add', [auth, upload.single('avatar')], async (req, res) => {
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
    let imagePath = null;
    if(req.file){

        const extension = path.extname(req.file.originalname)
        imagePath = req.file.filename
    }
    const userId = req.user.userId;
    const birthDateParsed = new Date(Date.parse(petBirthDate))
    const rod_isConfirmedToInt = rod_isConfirmed ? 1 : 0;

    try {
        let result = await db.execute("INSERT INTO tind.petProfile (user_id, petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, pet_isActive, petCity_id, dogKind_id, petAvatar) " +
            "VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [userId, petName, isFemine, birthDateParsed, codeKleimo, numberKleimo, rod_isConfirmedToInt, petClub, 1, city, dogKind, imagePath]);
        res.status(201).json({message: 'success'})
        
    } catch (e) {
        db.end();
        console.log(e);
    }
})

router.get('/ofUser', auth, async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await db.execute("SELECT t.petProfile_id, t.petName, t.isFemine, t.petBirthDate, t.codeKleimo, t.numberKleimo, t.rod_isConfirmed, t.petClub, t.pet_isActive, t.petCity_id, t.dogKind_id, t.petAvatar FROM tind.petProfile t WHERE t.user_id=?", [userId])
        const userPets = result[0];
        res.json(userPets);
        
    } catch (e) {
        res.status(500).json({message: "Неизвестная ошибка"})
    }
})

router.get('/searchCandidates', auth, async (req, res) => {
    const petId = req.query.pet_id;
    const userId = req.user.userId;
    let pet;

    //12

    try {
        const petSearch = await db.execute("SELECT t.petProfile_id, t.dogKind_id, t.isFemine, t.user_id FROM tind.petProfile t WHERE t.petProfile_id=? AND t.user_id=?", [petId, userId])
        if (petSearch.length > 0 && petSearch[0].length > 1) {
            res.status(400).json({message: 'Питомец с указанным идентификатором не найден у хозяина'})

        } else {
            pet = petSearch[0][0];
            const result = await db.execute("select t.petProfile_id, t.petName, t.codeKleimo, t.numberKleimo, " +
                "t.rod_isConfirmed, t.petBirthDate, t.petAvatar from tind.petProfile t " +
                "left join tind.petDislikesList pDL on t.petProfile_id = pDL.petProfile_id where t.petProfile_id not like ?\n" +
                "and t.dogKind_id like ? and t.isFemine != ? and t.petProfile_id not in " +
                "(select tind.petDislikesList.dislikePetProfile_id " +
                "from tind.petDislikesList where tind.petDislikesList.petProfile_id=?)\n" +
                "and t.petProfile_id not in (select tind.petLikesList.petProfile2_id from tind.petLikesList " +
                "where tind.petLikesList.petProfile1_id like ? and tind.petLikesList.pet1_likes_2=1)\n" +
                "and t.petProfile_id not in (select tind.petLikesList.petProfile1_id from tind.petLikesList " +
                "where tind.petLikesList.petProfile2_id like ? and tind.petLikesList.pet2_likes_1=1)\n" +
                "and t.user_id not like ? LIMIT 15", [pet.petProfile_id, pet.dogKind_id, pet.isFemine, pet.petProfile_id,
                pet.petProfile_id, pet.petProfile_id, pet.user_id]);
            const candidates = result[0]
            res.json(candidates);
        }
        
    } catch (e) {
        res.status(500).json({message: "Неизвестная ошибка"})
    }


})


router.get('/avatar', async (req, res) => {
    const img = req.query.img;
    img.split('.').slice(0, -1).join('.');

    res.download(path.resolve(__dirname, "../uploads", img))
})

router.post('/likes', auth, async (req, res) => {
    const {likeSenderId, likeRecieverId} = req.body;
    const userId = req.user.userId;

    try {
        const senderSearch = await db.execute("SELECT t.petProfile_id FROM tind.petProfile t WHERE t.petProfile_id=? AND t.user_id=?", [likeSenderId, userId])
        const recieverSearch = await db.execute("SELECT t.petProfile_id FROM tind.petProfile t WHERE t.petProfile_id=?", [likeRecieverId])
        if ((senderSearch.length === 0 || senderSearch[0].length===0) || (recieverSearch.length === 0 || recieverSearch[0].length===0)) {
            res.status(400).json({message: 'Отправитель/Получатель лайка не найден(ы)'})
        } else {
            //второй меня уже лайкал, то поставь, что я тоже его лайкаю
            const forwardSearch = await db.execute("select tp.petLikesList_id from tind.petLikesList tp " +
                "where (tp.petProfile1_id like ? and tp.petProfile2_id like ? and tp.pet2_likes_1 = 1)",
                [likeSenderId, likeRecieverId]);

            if(forwardSearch[0].length>0){
                const petLikesList_id = forwardSearch[0][0];
                const updateLike = await db.execute("UPDATE tind.petLikesList t SET t.pet1_likes_2 = 1 " +
                    "WHERE t.petLikesList_id like ?", [petLikesList_id])
            }else{
                const reverseSearch = await db.execute("select tp.petLikesList_id from tind.petLikesList tp " +
                    "where (tp.petProfile2_id like ? and tp.petProfile1_id like ? and tp.pet1_likes_2 = 1)",
                    [likeSenderId , likeRecieverId])
                if(reverseSearch[0].length>0) {
                    const petLikesList_id = reverseSearch[0][0].petLikesList_id;
                    const updateLike = await db.execute("UPDATE tind.petLikesList t SET t.pet2_likes_1 = 1 " +
                        "WHERE t.petLikesList_id like ?", [petLikesList_id])
                }else{
                    //новый лайк
                    const insertNewLike = await db.execute("INSERT INTO tind.petLikesList " +
                        "(petProfile1_id, petProfile2_id, pet1_likes_2, pet2_likes_1) VALUES (?, ?, 1, 0)",
                        [likeSenderId, likeRecieverId])
                }
            }
            res.status(201).json({message: 'success'})
        }
        
    } catch (e) {
        res.status(500).json({message: "Неизвестная ошибка"})
    }
})

//получение списка поклонников
router.get('/likes', auth, async (req, res) => {
    const petId = req.query.pet_id;
    const userId = req.user.userId;
    let pet;

    try {
        const petSearch = await db.execute("SELECT t.petProfile_id, t.dogKind_id, t.isFemine, t.user_id FROM tind.petProfile t WHERE t.petProfile_id=? AND t.user_id=?", [petId, userId])
        if (petSearch.length === 0 ||  petSearch[0].length===0) {
            res.status(400).json({message: 'Питомец с указанным идентификатором не найден у хозяина'})

        } else {
            pet = petSearch[0][0];
            //const forwardSearch = await db.execute("select petProfile1_id, petName, petBirthDate, isFemine, petAvatar  " +
            //    "from tind.petLikesList left join tind.petProfile on petLikesList.petProfile1_id = petProfile.petProfile_id " +
            //    "where (petLikesList.petProfile2_id like ? " +
            //    "and petLikesList.pet1_likes_2 = 1 and petLikesList.pet2_likes_1=0) and petLikesList.petProfile1_id" +
            //    "not in (select tp.dislikePetProfile_id from tind.petDislikesList tp where" +
            //    "tp.petProfile_id like ?)", [petId, petId]);
            //const reverseSearch = await db.execute("select petProfile2_id, petName, petBirthDate, isFemine, petAvatar  " +
             //   "from tind.petLikesList left join tind.petProfile on petLikesList.petProfile2_id = petProfile.petProfile_id " +
             //   "where (petLikesList.petProfile1_id like ? and petLikesList.pet2_likes_1 = 1 and petLikesList.pet1_likes_2 = 0)" +
             //   "and petLikesList.petProfile2_id not in (select tp.dislikePetProfile_id from tind.petDislikesList tp " +
             //   "where tp.petProfile_id like ?)",
             //   [petId, petId]);
            const forwardSearch = await db.execute("select petProfile1_id, petName, petBirthDate, isFemine, petAvatar, codeKleimo, numberKleimo  " +
                "from tind.petLikesList left join tind.petProfile on petLikesList.petProfile1_id = petProfile.petProfile_id " +
                "where (petLikesList.petProfile2_id like ? " +
                "and petLikesList.pet1_likes_2 = 1 and petLikesList.pet2_likes_1=0)", [petId]);
            const reverseSearch = await db.execute("select petProfile2_id, petName, petBirthDate, isFemine, petAvatar, codeKleimo, numberKleimo  " +
               "from tind.petLikesList left join tind.petProfile on petLikesList.petProfile2_id = petProfile.petProfile_id " +
               "where (petLikesList.petProfile1_id like ? and petLikesList.pet2_likes_1 = 1 and petLikesList.pet1_likes_2 = 0)",
               [petId]);
            const forwardArray = forwardSearch[0]
            const reverseArray = reverseSearch[0]
            forwardArray.push(...reverseArray)
            res.json(forwardArray);
        }
        
    } catch (e) {
        res.status(500).json({message: "Неизвестная ошибка"})
    }


})

router.get('/matches', auth, async (req, res) => {
    const petId = req.query.pet_id;
    const userId = req.user.userId;
    let pet;

    try {
        const petSearch = await db.execute("SELECT t.petProfile_id, t.dogKind_id, t.isFemine, t.user_id FROM tind.petProfile t WHERE t.petProfile_id=? AND t.user_id=?", [petId, userId])
        if (petSearch.length === 0 ||  petSearch[0].length===0) {
            res.status(400).json({message: 'Питомец с указанным идентификатором не найден у хозяина'})

        } else {
            pet = petSearch[0][0];
            const forwardSearch = await db.execute("select petProfile2_id, petName, petBirthDate, isFemine, petAvatar, codeKleimo, numberKleimo " +
                "from tind.petLikesList left join tind.petProfile on petLikesList.petProfile2_id = petProfile.petProfile_id " +
                "where (petLikesList.petProfile1_id like ? and petLikesList.pet1_likes_2 = 1 and petLikesList.pet2_likes_1 = 1)",
                [petId]);
            const reverseSearch = await db.execute("select petProfile1_id, petName, petBirthDate, isFemine, petAvatar, codeKleimo, numberKleimo " +
                "from tind.petLikesList left join tind.petProfile on petLikesList.petProfile1_id = petProfile.petProfile_id " +
                "where (petLikesList.petProfile2_id like ? and petLikesList.pet2_likes_1 = 1 and petLikesList.pet1_likes_2 = 1 )",
                [petId]);
            const forwardArray = forwardSearch[0]
            const reverseArray = reverseSearch[0]
            forwardArray.push(...reverseArray)
            res.json(forwardArray);
        }
        
    } catch (e) {
        res.status(500).json({message: "Неизвестная ошибка"})
    }


})

//dislikes
router.post('/dislikes', auth, async (req, res) => {
    const {disLikeSenderId, disLikeRecieverId} = req.body;
    const userId = req.user.userId;

    try {
        const senderSearch = await db.execute("SELECT t.petProfile_id FROM tind.petProfile t WHERE t.petProfile_id=? AND t.user_id=?", [disLikeSenderId, userId])
        const recieverSearch = await db.execute("SELECT t.petProfile_id FROM tind.petProfile t WHERE t.petProfile_id=?", [disLikeRecieverId])
        if ((senderSearch.length === 0 || senderSearch[0].length===0) || (recieverSearch.length === 0 || recieverSearch[0].length===0)) {
            res.status(400).json({message: 'Отправитель/Получатель дизлайка не найден(ы)'})
        } else {
            //ищем, что не дизлайкал ранее
            const disLikeSearch = await db.execute("select tp.petDislikesList_id from tind.petDislikesList tp " +
                "where (tp.petProfile_id like ? and tp.dislikePetProfile_id like ? )",
                [disLikeSenderId, disLikeRecieverId]);
            //если не дизлайкал, то устанавливаем дизлайк
            if(disLikeSearch[0].length===0){
                const insertNewDislike = await db.execute("INSERT INTO tind.petDislikesList " +
                    "(petProfile_id, dislikePetProfile_id) VALUES (?, ?)",
                    [disLikeSenderId, disLikeRecieverId])
            }
            //потом убираем лайки, если они были установлены
            const like1Search = await db.execute("select tp.petLikesList_id from tind.petLikesList tp " +
                    "where (tp.petProfile2_id like ? and tp.petProfile1_id like ? and tp.pet1_likes_2 = 1)",
                    [disLikeRecieverId , disLikeSenderId])
            //убираем лайк,если нашли
            if(like1Search[0].length>0) {
                    const petLikesList_id = reverseSearch[0][0].petLikesList_id;
                    const updateLike = await db.execute("UPDATE tind.petLikesList t SET t.pet1_likes_2 = 0 " +
                        "WHERE t.petLikesList_id like ?", [petLikesList_id])
                }
            const like2Search = await db.execute("select tp.petLikesList_id from tind.petLikesList tp " +
                    "where (tp.petProfile1_id like ? and tp.petProfile2_id like ? and tp.pet2_likes_1 = 1)",
                    [disLikeRecieverId , disLikeSenderId])
            //убираем лайк,если нашли
            if(like2Search[0].length>0) {
                    const petLikesList_id = reverseSearch[0][0].petLikesList_id;
                    const updateLike = await db.execute("UPDATE tind.petLikesList t SET t.pet2_likes_1 = 0 " +
                        "WHERE t.petLikesList_id like ?", [petLikesList_id])
            }
            res.status(201).json({message: 'success'})
        }
        
    } catch (e) {
        res.status(500).json({message: "Неизвестная ошибка"})
    }
})

//получение списка чатов
router.get('/chats', auth, async (req, res) => {
    const petId = req.query.pet_id;

    try {
        const chatSearch = await db.execute("SELECT t.chat_id from tind.chats t " +
            "WHERE t.chatPetProfile1 like ? or t.chatPetProfile2 like ?", [petId, petId])
        if (chatSearch.length === 0 ||  chatSearch[0].length===0) {
            res.status(400).json({message: 'У питомца не найдено ни одного чата'})

        } else {
            //chat = chatSearch[0][0];
            const forwardSearch = await db.execute("select chat_id, chatPetProfile1, petName, petBirthDate, petAvatar  " +
                "from tind.chats left join tind.petProfile on chats.chatPetProfile1 = petProfile.petProfile_id " +
                "where chats.ChatPetProfile2 like ? ", [petId]);
            const reverseSearch = await db.execute("select chat_id, ChatPetProfile2, petName, petBirthDate, petAvatar  " +
                "from tind.chats left join tind.petProfile on chats.ChatPetProfile2 = petProfile.petProfile_id " +
                "where chats.chatPetProfile1 like ? ",
                [petId]);
            const forwardArray = forwardSearch[0]
            const reverseArray = reverseSearch[0]
            forwardArray.push(...reverseArray)
            res.json(forwardArray);
        }
        // 
    } catch (e) {
        db.end();
        res.status(500).json({message: "Неизвестная ошибка"})
    }
})

//получение чата по ид питомцев
router.get('/chatLinesByPetsId', auth, async (req, res) => {
    const myPetId = req.query.pet_id1;
    const hisPetId = req.query.pet_id2;

    try {
        chatSearch = await db.execute("SELECT t.chat_id from tind.chats t " +
            "WHERE (t.chatPetProfile1=? and t.ChatPetProfile2=?) " +
            "or (t.chatPetProfile2=? and t.ChatPetProfile1=?)", [myPetId, hisPetId, myPetId, hisPetId])
        if (chatSearch[0].length > 0) {
            const chat_id = chatSearch[0][0].chat_id;
            res.json(chat_id);
        } else {
            //новый чат
            const insertNewChat = await db.execute("INSERT INTO tind.chats " +
                "(chatPetProfile1, ChatPetProfile2) VALUES (?, ?)",
                [myPetId, hisPetId])
            //ищем ид
            const chatSearch = await db.execute("SELECT t.chat_id from tind.chats t" +
                "WHERE (t.chatPetProfile1=? and t.ChatPetProfile2=?) " +
                "or (t.chatPetProfile2=? and t.ChatPetProfile1=?)", [myPetId, hisPetId, myPetId, hisPetId])
            //возвращаем ид
            if (chatSearch[0].length > 0) {
                const chat_id = chatSearch[0][0].chat_id;
                res.json(chat_id);
            }
        }
        
    } catch (e) {
        res.status(500).json({message: "Неизвестная ошибка"})
    }
})

//получение записей чата по ид чата
router.get('/chatLinesByChatId', auth, async (req, res) => {
    const chatId = req.query.chat_id;

    try {
        const chatLineSearch = await db.execute("select chatLine_id, chat_id, chatLinePetProfile_id, chatLineMessage," +
             "chatLineCreated_at, petName  " +
             "from tind.chatLines left join tind.petProfile on chatLines.chatLinePetProfile_id=petProfile.petProfile_id" +
             " where chat_id like ? order by chatLineCreated_at", [chatId])
        if (chatLineSearch.length === 0 ||  chatLineSearch[0].length===0) {
            res.status(400).json({message: 'В чате нет записей'})
        } else {
            const forwardArray = chatLineSearch[0]
            res.json(forwardArray);

            // const forwardSearch = await db.execute("select chat_id, chatLinePetProfile_id, chatLineMessage," +
            //     "chatLineCreated_at, petName  " +
            //     "from tind.chatLines left join tind.petProfile on chatLines.chatLinePetProfile_id=petProfile.petProfile_id" +
            //     "where chat_id like ? order by chatLineCreated_at", [chatId]);
            // const forwardArray = forwardSearch[0]
            // res.json(forwardArray);
        }
    } catch (e) {
        res.status(500).json({message: "Неизвестная ошибка"})
    }
})

//создание записи чата по ид чата и питомца
router.post('/chatLinesByChatId', auth, async (req, res) => {
    const {chatID, myPetId, myMessage } = req.body;

    //ищем, существует ли чат
    try {
        const chatSearch = await db.execute("SELECT t.chat_id from tind.chats t " +
            "WHERE t.chat_id=? and (t.chatPetProfile1=? or t.ChatPetProfile2=?)", [chatID, myPetId, myPetId])
        if (chatSearch[0].length > 0) {
            const chat_id = chatSearch[0][0].chat_id;
            const creatChatLine = await db.execute("INSERT INTO tind.chatLines " +
                "(chat_id, chatLinePetProfile_id, chatLineMessage) VALUES (?, ?, ?)",
                [chat_id, myPetId, myMessage])
        } else {
            res.status(400).json({message: 'Чат не найден.'})
        }
        res.status(201).json({message: 'success'})
    }
    catch (e) {
        res.status(500).json({message: "Неизвестная ошибка"})
    }
})

//создание чата (мой пишет ему) по ид питомцев
router.post('/chatLinesByPetsId', auth, async (req, res) => {

    const myPetId = req.query.pet_id1;
    const hisPetId = req.query.pet_id2;

    //ищем, существует ли чат
    try {
        const chatSearch = await db.execute("SELECT t.chat_id from tind.chats t" +
            "WHERE (t.chatPetProfile1=? and t.ChatPetProfile2=?) " +
            "or (t.chatPetProfile2=? and t.ChatPetProfile1=?)", [myPetId, hisPetId, myPetId, hisPetId])
        if (chatSearch[0].length === 0) {
            //новый чат
            const insertNewChat = await db.execute("INSERT INTO tind.chats " +
                "(chatPetProfile1, ChatPetProfile2) VALUES (?, ?)",
                [myPetId, hisPetId])
            //ищем ид
            const chatSearch = await db.execute("SELECT t.chat_id from tind.chats t" +
                "WHERE (t.chatPetProfile1=? and t.ChatPetProfile2=?) " +
                "or (t.chatPetProfile2=? and t.ChatPetProfile1=?)", [myPetId, hisPetId, hisPetId, myPetId])
            res.json(chatSearch);
        }
    }
    catch (e) {
        res.status(500).json({message: "Неизвестная ошибка"})
    }
})

module.exports = router;