const router = require("express").Router();
const playlistController = require("../controllers/playlistController");
const multer = require("multer");
const diskStorage = require("../helpers/multer");

const filePhoto = multer({ storage: diskStorage }).single("img");

router.get("/", playlistController.getPlaylist);
router.post("/", filePhoto, playlistController.addPlaylist);
router.put("/:playlistId", filePhoto, playlistController.editPlaylist);
router.patch("/:playlistId/:songId", playlistController.addSong);
router.delete("/:playlistId/:songId", playlistController.deleteSong);
router.delete("/:playlistId", playlistController.deletePlaylist);

module.exports = router;
