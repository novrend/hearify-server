const { User } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { signJWT } = require("../helpers/jwt");

class Controller {
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw {
          code: 401,
          msg: "Username/Password Cannot Be Empty",
        };
      }
      const findUser = await User.findOne({
        where: {
          [Op.or]: {
            email: username,
            username,
          },
        },
      });
      if (!findUser) {
        throw {
          code: 401,
          msg: "Invalid username / email / password",
        };
      }
      if (!bcrypt.compareSync(password, findUser.password)) {
        throw {
          code: 401,
          msg: "Invalid username / email / password",
        };
      }
      const access_token = signJWT({
        id: findUser.id,
      });
      res.status(200).json({
        statusCode: 200,
        access_token,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
