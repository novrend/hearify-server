const { User, Transaction } = require("../models");
const axios = require("axios");
const { signJWT, verifyJWT } = require("../helpers/jwt");

class Controller {
  static async me(req, res, next) {
    try {
      const { id } = req.user;
      const userDetail = await Transaction.findOne({
        where: {
          UserId: id,
        },
      });
      res.status(200).json(userDetail);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
