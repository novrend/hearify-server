const router = require("express").Router();
const user = require("./user");
const transaction = require("./transaction");
const playlist = require("./playlist");

router.use("/", user);
router.use("/transaction", transaction);
router.use("/playlist", playlist);
router.use(error);

module.exports = router;
