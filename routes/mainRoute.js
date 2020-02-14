const router = require('express').Router();
const getMusicList = require('../controllers/musicList.get');


router.get('/music', getMusicList);


module.exports = router;