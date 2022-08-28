const { User, Movie } = require("../models");
const { verifyJWT } = require("../helpers/jwt");

const isLoggedIn = async (req, res, next) => {
  try {
    let { access_token } = req.headers;
    if (!access_token) {
      throw { name: 401, message: "Missing Token" };
    }

    const payload = verifyJWT(access_token);
    const user = await User.findByPk(payload.id);
    if (!user) {
      throw { name: 401, message: "Token Invalid" };
    }
    req.user = {
      id: user.id,
      isConfirmed: user.isConfirmed,
      premium: user.premium,
    };
    next();
  } catch (err) {
    next(err);
  }
};

const isAuthorized = async (req, res, next) => {
  try {
    const { id: userId, isConfirmed, premium } = req.user;
    const { playlistId, songId } = req.params;

    if (!isConfirmed) {
      throw { name: 401, message: "account not confirmed" };
    }
    if (!premium) {
      throw { name: 401, message: "account not premium" };
    }
    const playlist = await Playlist.findByPk(playlistId);

    if (!playlist) {
      throw { name: 404, message: "Playlist Not Found" };
    }

    if (songId) {
      const findSong = await Song.findByPk(songId)
      if (!findSong) {
        throw { name: 404, message: "Song Not Found" };
      }
    }

    if (!(userRole === "admin" || userId === playlist.UserId)) {
      throw { name: 403, message: "Forbidden" };
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { isLoggedIn, isAuthorized };
