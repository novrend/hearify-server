const router = require("express").Router();
const userController = require("../controllers/userController");
const { isLoggedIn } = require("../middlewares/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/me", userController.me);
router.post("/google-sign-in", userController.googleSignIn);
router.patch("/confirm", isLoggedIn, userController.confirm);
router.get("/resend-confirm-code", userController.changeConfirmCode);
router.post("/forgot-password", userController.sendResetPassword);
router.patch("/forgot-password", userController.resetPassword);

module.exports = router;
