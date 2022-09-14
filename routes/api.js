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
router.get("/get-playlist-by-genre", apiController.getPlaylistByGenre);
router.get("/get-genre", apiController.getGenreList);
router.get("/find-playlist-by-genre", apiController.findPlaylist);

module.exports = router;
