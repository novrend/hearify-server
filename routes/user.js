const router = require("express").Router();
const userController = require("../controllers/userController");
const { checkLogin } = require("../middlewares/auth");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/me", checkLogin, userController.me);
router.patch("/confirm", checkLogin, userController.confirm);
router.get("/resend-confirm-code", userController.changeConfirmCode);
router.post("/forgot-password", userController.sendResetPassword);
router.patch("/forgot-password", userController.resetPassword);
router.get("/sign-in", userController.signin);

module.exports = router;
