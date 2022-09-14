const router = require("express").Router();
const apiController = require("../controllers/apiController");
const { isLoggedIn } = require("../middlewares/auth");

router.use(isLoggedIn);
router.get("/get-album", apiController.getAlbumDetail);

module.exports = router;
