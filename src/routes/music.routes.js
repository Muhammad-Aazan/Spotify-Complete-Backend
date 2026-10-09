const express = require("express")
const musicController = require("../controllers/music.controller");
const multer = require("multer");
const authMiddleware = require("../middlewares/auth.middlewares");

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

router.post('/upload', upload.single("music"), musicController.createMusic);

router.post('/album', authMiddleware.authArtist, musicController.createAlbum);

router.get("/" , authMiddleware.authUser , musicController.getAllMusic);
router.get("/allAlbums" , authMiddleware.authUser , musicController.getAllAlbums);



module.exports = router; 