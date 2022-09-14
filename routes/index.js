const router = require("express").Router();
const user = require("./user");
const transaction = require("./transaction");
const playlist = require("./playlist");
const api = require("./api");
const error = require("../middlewares/error");

router.use("/", user);
router.use("/transaction", transaction);
router.use("/playlist", playlist);
router.use("/api", api);
router.use(error);

module.exports = router;
