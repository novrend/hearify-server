const router = require("express").Router();
const apiController = require("../controllers/apiController");
const { isLoggedIn } = require("../middlewares/auth");

router.use(isLoggedIn);
router.get("/get-album", apiController.getAlbumDetail);
router.get("/get-new-release", apiController.getNewReleases);
router.get("/get-artist", apiController.getArtistDetail);
router.get("/get-playlist", apiController.getPlaylistDetail);

module.exports = router;
