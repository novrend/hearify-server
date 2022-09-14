const router = require("express").Router();
const transactionController = require("../controllers/transactionController");
const { checkLogin } = require("../middlewares/auth");

router.get("/me", checkLogin, transactionController.me);

module.exports = router;
