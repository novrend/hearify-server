const router = require("express").Router();
const playlistController = require("../controllers/playlistController");
const { isLoggedIn, isAuthorized } = require("../middlewares/auth");
const multer = require("multer");
const diskStorage = require("../helpers/multer");

const filePhoto = multer({
  storage: diskStorage,
  fileFilter: (req, file, cb) => {
    const fileSize = parseInt(req.headers["content-length"]);

    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else if (fileSize > 1048576 / 2) {
      return cb({ code: 400, msg: "File size too big" });
    } else {
      cb(null, false);
      return cb({ code: 400, msg: "File format not allowed" });
    }
  },
  limits: {
    fieldNameSize: 64,
    fileSize: 1048576 / 2,
  },
}).single("img");

router.use(isLoggedIn);
router.get("/", playlistController.getPlaylist);
router.post("/", filePhoto, playlistController.addPlaylist);
router.get("/:playlistId", isAuthorized, playlistController.getPlaylistDetail);
router.put(
  "/:playlistId",
  isAuthorized,
  filePhoto,
  playlistController.editPlaylist
);
router.patch("/:playlistId/:songId", isAuthorized, playlistController.addSong);
router.delete(
  "/:playlistId/:songId",
  isAuthorized,
  playlistController.deleteSong
);
router.delete("/:playlistId", isAuthorized, playlistController.deletePlaylist);

module.exports = router;
