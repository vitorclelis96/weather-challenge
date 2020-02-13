const router = require('express').Router();
const getMusicList = require('../controllers/musicList.get');


router.get('/', getMusicList);


module.exports = router;