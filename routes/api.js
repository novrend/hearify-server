const router = require("express").Router();
const apiController = require("../controllers/apiController");
const { isLoggedIn } = require("../middlewares/auth");

router.use(isLoggedIn);
router.get("/get-album", apiController.getAlbumDetail);
router.get("/get-new-release", apiController.getNewReleases);
router.get("/get-artist", apiController.getArtistDetail);
router.get("/get-playlist", apiController.getPlaylistDetail);
router.get("/search-song", apiController.searchSong);
router.get("/get-song", apiController.getSong);
router.get("/get-featured-playlist", apiController.getFeaturedPlaylist);

module.exports = router;
