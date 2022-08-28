const { Playlist, User, Transaction } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { signJWT, verifyJWT } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
const sendMail = require("../helpers/mailer");

class Controller {
  static async me(req, res, next) {
    try {
      const { id } = req.user;
      const userDetail = await User.findByPk(id);
      res.status(200).json({
        statusCode: 200,
        data: userDetail,
      });
    } catch (err) {
      next(err);
    }
  }

  static async googleSignIn(req, res, next) {
    try {
      const { google_token } = req.body;
      const client = new OAuth2Client(process.env.CLIENT_ID_GOOGLE);
      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.CLIENT_ID_GOOGLE,
      });
      const payload = ticket.getPayload();

      const [user, isCreated] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          email: payload.email,
          name: payload.name,
          password: "Google",
        },
        hooks: false,
      });

      const access_token = signJWT({
        id: user.id,
      });

      const statusCode = isCreated ? 201 : 200;
      res.status(statusCode).json({
        statusCode,
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
      res.status(201).json({
        statusCode: 201,
        data: {
          id: newUser.id,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw {
          name: 401,
          message: {
            input: "Username/Password Cannot Be Empty",
          },
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
          name: 401,
          message: {
            input: "Invalid username/email/password",
          },
        };
      }
      if (!bcrypt.compareSync(password, findUser.password)) {
        throw {
          name: 401,
          message: {
            input: "Invalid username/email/password",
          },
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

  static async confirm(req, res, next) {
    try {
      const { confirmationCode } = req.body;
      // isConfirmed
      if (!confirmationCode) {
        throw {
          name: 401,
          message: {
            input: "Confirmation Code Cannot Be Empty",
          },
        };
      }
      const { id } = req.user;
      const findUser = await User.findOne({
        where: {
          id,
          confirmationCode,
        },
      });
      if (!findUser) {
        throw {
          name: 401,
          message: {
            input: "Invalid confirmation code",
          },
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
        statusCode: 201,
        message: "Account Confirmed",
      });
    } catch (err) {
      next(err);
    }
  }

  static async changeConfirmCode(req, res, next) {
    try {
      const { id } = req.user;
      // isConfirmed
      const confirmationCode = Math.floor(1000 + Math.random() * 9000);
      // mailer
      await User.update({ confirmationCode }, { where: id });
      res.status(201).json({
        statusCode: 201,
        message: "Confirmation Code Sended",
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
          name: 401,
          message: {
            input: "Username/Email Cannot Be Empty",
          },
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
          name: 401,
          message: {
            input: "Invalid username/email",
          },
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
        message: "Reset Code Sended",
      });
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { username, password, code } = req.body;
      // if resetCode === null
      if (!username || !password || !code) {
        throw {
          name: 401,
          message: {
            input: "Username/Password/Code Cannot Be Empty",
          },
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
          name: 401,
          message: {
            input: "Invalid email/reset code",
          },
        };
      }
      const hashPassword = bcrypt.hashSync(password, 10);
      await User.update(
        {
          password: hashPassword,
          resetCode: null,
        },
        {
          where: {
            email,
          },
        }
      );
      res.status(200).json({
        statusCode: 200,
        message: "Password Reset Successful",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
