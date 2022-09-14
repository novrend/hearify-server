const router = require("express").Router();
const playlistController = require("../controllers/playlistController");
const { isLoggedIn, isAuthorized } = require("../middlewares/auth");

module.exports = router;
