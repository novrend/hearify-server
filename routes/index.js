const router = require("express").Router();
const playlist = require("./playlist");
const api = require("./api");
const user = require("./user");
const transaction = require("./transaction");
const error = require("../middlewares/error");

router.use("/", user);
router.use("/api", api);
router.use("/playlist", playlist);
router.use("/transaction", transaction);
router.use(error);

module.exports = router;
