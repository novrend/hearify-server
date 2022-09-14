const { User, Playlist } = require("../models");
const { verifyJWT } = require("../helpers/jwt");

const checkLogin = async (req, res, next) => {
  try {
    let { access_token } = req.headers;
    if (!access_token) {
      throw { code: 401, msg: "Missing Token" };
    }

    const payload = verifyJWT(access_token);
    const user = await User.findByPk(payload.id);
    if (!user) {
      throw { code: 401, msg: "Token Invalid" };
    }
    req.user = {
      id: user.id,
      isConfirmed: user.isConfirmed
    };
    next();
  } catch (err) {
    next(err);
  }
};

const isLoggedIn = async (req, res, next) => {
  try {
    let { access_token } = req.headers;
    if (!access_token) {
      throw { code: 401, msg: "Missing Token" };
    }

    const payload = verifyJWT(access_token);
    const user = await User.findByPk(payload.id);
    if (!user) {
      throw { code: 401, msg: "Token Invalid" };
    }
    if (!user.isConfirmed) {
      throw { code: 401, msg: "account not confirmed" };
    }
    if (!user.premium) {
      throw { code: 401, msg: "account not premium" };
    }
    req.user = {
      id: user.id,
    };
    next();
  } catch (err) {
    next(err);
  }
};

const isAuthorized = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { playlistId } = req.params;

    const playlist = await Playlist.findByPk(playlistId);

    if (!playlist) {
      throw { code: 404, msg: "Playlist Not Found" };
    }

    if (userId !== playlist.UserId) {
      throw { code: 403, msg: "Forbidden" };
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { isLoggedIn, isAuthorized, checkLogin };
