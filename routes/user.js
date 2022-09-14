const router = require("express").Router();
const userController = require("../controllers/userController");
const { checkLogin } = require("../middlewares/auth");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/me", checkLogin, userController.me);
router.patch("/confirm", checkLogin, userController.confirm);
router.get("/resend-confirm-code", userController.changeConfirmCode);

module.exports = router;
