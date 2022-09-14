const { Playlist, PlaylistSong } = require("../models");

class Controller {
  static async getPlaylist(req, res, next) {
    try {
      const { id } = req.user;
      const playlist = await Playlist.findAll({
        where: {
          UserId: id,
        },
      });
      res.status(200).json({
        statusCode: 200,
        data: playlist,
      });
    } catch (err) {
      next(err);
    }
  }

  static async addPlaylist(req, res, next) {
    try {
      const { filename } = req.file;
      const { id } = req.user;
      const { name } = req.body;
      await Playlist.create({
        name,
        imageUrl: `${process.env.BASE_URL_SERVER}/image/${filename}`,
        UserId: id,
      });
      res.status(201).json({
        statusCode: 201,
        message: "Playlist created successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
