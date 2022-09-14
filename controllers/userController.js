const { User } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { signJWT } = require("../helpers/jwt");
const sendMail = require("../helpers/mailer");

class Controller {
  static async signin(req, res, next) {
    const { access_token } = req.headers;
    const payload = jwt.verify(access_token, process.env.SUPABASE_SECRET);
    if (payload) {
      const [user, isCreated] = await User.findOrCreate({
        where: {
          email: payload.user_metadata.email,
          username: payload.user_metadata.email,
        },
        defaults: {
          email: payload.user_metadata.email,
          password: null,
          name: payload.user_metadata.full_name,
          username: payload.user_metadata.email,
          premium: false,
          isConfirmed: true,
        },
        skip: ["email", "username", "password"],
        hooks: false,
      });
      const access_token = signJWT({
        id: user.id,
      });
      res.status(isCreated ? 201 : 200).json({
        access_token,
        isPremium: user.premium,
      });
    }
  }

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

  static async confirm(req, res, next) {
    try {
      const { id, isConfirmed } = req.user;
      const { confirmationCode } = req.body;
      if (isConfirmed) {
        throw { code: 400, msg: "Account already confirmed" };
      }
      if (!confirmationCode) {
        throw {
          code: 401,
          msg: "Confirmation Code Cannot Be Empty",
        };
      }
      const findUser = await User.findOne({
        where: {
          id,
          confirmationCode,
        },
      });
      if (!findUser) {
        throw {
          code: 401,
          msg: "Invalid confirmation code",
        };
      }
      await User.update({ isConfirmed: true }, { where: { id } });
      const content = {
        body: {
          to: findUser.email,
          subject: "Welcome to Hearify",
          text: "Account Verified",
          html: `<b>Hi ${findUser.name}, welcome to Hearify<br>Your account has been confirmed</b>`,
        },
      };
      await sendMail(content);
      res.status(201).json({
        message: "Account Confirmed",
      });
    } catch (err) {
      next(err);
    }
  }

  static async changeConfirmCode(req, res, next) {
    try {
      const { id, isConfirmed } = req.user;
      if (isConfirmed) {
        throw { code: 400, msg: "Account already confirmed" };
      }
      const confirmationCode = Math.floor(1000 + Math.random() * 9000);
      await User.update({ confirmationCode }, { where: id });
      const content = {
        body: {
          to: email,
          subject: "Hearify Account Verification",
          text: "Account Verification",
          html: `<b>Your confirmation code is ${confirmationCode}</b>`,
        },
      };
      await sendMail(content);
      res.status(201).json({
        statusCode: 201,
        msg: "Confirmation Code Sended",
      });
    } catch (err) {
      next(err);
    }
  }

  static async sendResetPassword(req, res, next) {
    try {
      const { username } = req.body;
      if (!username) {
        throw {
          code: 401,
          msg: "Username/Email Cannot Be Empty",
        };
      }
      const findUser = await User.findOne({
        where: {
          [Op.or]: {
            username,
            email: username,
          },
        },
      });
      if (!findUser) {
        throw {
          code: 401,
          msg: "Invalid username/email",
        };
      }
      const resetCode = Math.floor(1000 + Math.random() * 9000);
      await User.update(
        {
          resetCode,
        },
        {
          where: {
            id: findUser.id,
          },
        }
      );
      const content = {
        body: {
          to: findUser.email,
          subject: "Reset Password",
          text: "Account Verified",
          html: `<b>Your reset code is ${resetCode}</b>`,
        },
      };
      await sendMail(content);
      res.status(200).json({
        statusCode: 200,
        msg: "Reset Code Sended",
      });
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { username, password, code } = req.body;
      if (!username || !password || !code) {
        throw {
          code: 401,
          msg: "Username/Password/Code Cannot Be Empty",
        };
      }
      const findUser = await User.findOne({
        where: {
          [Op.or]: {
            username,
            email: username,
          },
          resetCode: code,
        },
      });
      if (!findUser) {
        throw {
          code: 401,
          msg: "Invalid username/reset code",
        };
      }
      password = bcrypt.hashSync(password, 10);
      await User.update(
        {
          password,
          resetCode: null,
        },
        {
          where: {
            id: findUser.id,
          },
        }
      );
      res.status(200).json({
        statusCode: 200,
        msg: "Password Reset Successful",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
