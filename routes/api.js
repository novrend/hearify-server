const router = require("express").Router();
const apiController = require("../controllers/apiController");
const { isLoggedIn } = require("../middlewares/auth");

router.use(isLoggedIn);

module.exports = router;
