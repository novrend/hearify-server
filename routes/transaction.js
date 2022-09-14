const router = require("express").Router();
const transactionController = require("../controllers/transactionController");
const { checkLogin } = require("../middlewares/auth");

router.get("/me", checkLogin, transactionController.me);
router.get("/dana", checkLogin, transactionController.createTrxDana);
router.get("/qris", checkLogin, transactionController.createTrxQRIS);
router.get("/paid", transactionController.paidTransaction);
router.post("/paid", transactionController.paidTransaction);

module.exports = router;
