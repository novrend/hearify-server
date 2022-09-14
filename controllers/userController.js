const { User } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { signJWT } = require("../helpers/jwt");
const sendMail = require("../helpers/mailer");

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
        access_token,
      });
    } catch (err) {
      next(err);
    }
  }

  static async register(req, res, next) {
    try {
      const { username, email, password, name } = req.body;
      const newUser = await User.create({
        email,
        username,
        password,
        name,
      });
      const content = {
        body: {
          to: email,
          subject: "Hearify Account Verification",
          text: "Account Verification",
          html: `<b>Your confirmation code is ${newUser.confirmationCode}</b>`,
        },
      };
      await sendMail(content);
      const access_token = signJWT({
        id: newUser.id,
      });
      res.status(201).json({
        access_token,
      });
    } catch (err) {
      next(err);
    }
  }

  static async me(req, res, next) {
    try {
      const { id } = req.user;
      const userDetail = await User.findByPk(id);
      res.status(200).json({
        statusCode: 200,
        data: {
          id: userDetail.id,
          email: userDetail.email,
          name: userDetail.name,
          premium: userDetail.premium,
          isConfirmed: userDetail.isConfirmed,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
