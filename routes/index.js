const router = require("express").Router();
const user = require("./user");
const transaction = require("./transaction");

router.use("/", user);
router.use("/transaction", transaction);
router.use(error);

module.exports = router;
