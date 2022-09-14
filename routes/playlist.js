const router = require("express").Router();
const playlistController = require("../controllers/playlistController");
const { isLoggedIn, isAuthorized } = require("../middlewares/auth");

router.get("/", playlistController.getPlaylist);

module.exports = router;
