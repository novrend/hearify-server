const router = require("express").Router();
const apiController = require("../controllers/apiController");

router.get("/get-album", apiController.getAlbumDetail);
router.get("/get-artist", apiController.getArtistDetail);
router.get("/search-song", apiController.searchSong);
router.get("/get-featured-playlist", apiController.getFeaturedPlaylist);
router.get("/get-playlist-by-genre", apiController.getPlaylistByGenre);
router.get("/get-genre", apiController.getGenreList);
router.get("/find-playlist-by-genre", apiController.findPlaylist);

router.get("/trx", apiController.getBSCTrx)

module.exports = router;
