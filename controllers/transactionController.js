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

  static async createTrxDana(req, res, next) {
    try {
      const findTrx = await Transaction.findOne({
        where: {
          UserId: req.user.id,
        },
        include: {
          model: User,
        },
      });
      if (findTrx?.User?.isPremium) {
        throw { code: 400, msg: "User already premium" };
      }
      const access_token = signJWT({
        id: req.user.id,
      });
      const trxId = Date.now().toString();
      const response = await axios.post(
        "https://api.xendit.co/ewallets/charges",
        {
          reference_id: trxId,
          currency: "IDR",
          amount: 1,
          checkout_method: "ONE_TIME_PAYMENT",
          channel_code: "ID_DANA",
          channel_properties: {
            success_redirect_url: `${process.env.BASE_URL_SERVER}/transaction/paid?id=${trxId}&jwt=${access_token}`,
          },
        },
        {
          headers: {
            authorization: `Basic ${process.env.XENDIT_BASE64}`,
            "content-type": "application/json",
          },
        }
      );
      if (findTrx) {
        await Transaction.update(
          {
            transactionId: trxId,
            paymentGateway: "dana",
            url: response.data.actions.desktop_web_checkout_url,
          },
          {
            where: {
              id: findTrx.id,
            },
          }
        );
      } else {
        await Transaction.create({
          transactionId: trxId,
          paymentGateway: "dana",
          url: response.data.actions.desktop_web_checkout_url,
          UserId: req.user.id,
        });
      }
      res.status(201).json({
        paymentGateway: "dana",
        url: response.data.actions.desktop_web_checkout_url,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
