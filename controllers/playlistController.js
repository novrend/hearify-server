const { Playlist, User, Transaction } = require("../models");

class Controller {
  static async getPlaylist(req, res, next) {
    try {
      const { id } = req.user;
      const playlist = await Playlist.findAll({
        where: {
          id,
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
      const { name, desc } = req.body;
      await Playlist.create({
        name,
        imageUrl: filename,
        desc,
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

  static async editPlaylist(req, res, next) {
    try {
      const { filename } = req.file;
      const { name, desc } = req.body;
      const { playlistId } = req.params;
      await Playlist.update(
        {
          name,
          imageUrl: filename,
          desc,
        },
        {
          where: {
            id: playlistId,
          },
        }
      );
      res.status(200).json({
        statusCode: 200,
        message: "Playlist edited successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  static async deletePlaylist(req, res, next) {
    try {
      const { playlistId } = req.params;
      await Playlist.destroy({
        where: {
          id: playlistId,
        },
      });
      res.status(201).json({
        statusCode: 201,
        message: "Playlist deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  static async addSong(req, res, next) {
    try {
      const { playlistId, songId } = req.params;
      await PlaylistSong.create({
        PlaylistId: playlistId,
        SongId: songId,
      });
      res.status(201).json({
        statusCode: 201,
        message: "Success add song to your playlist",
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteSong(req, res, next) {
    try {
      const { playlistId, songId } = req.params;
      await PlaylistSong.destroy({
        where: {
          PlaylistId: playlistId,
          SongId: songId,
        },
      });
      res.status(200).json({
        statusCode: 200,
        message: "Success delete song from your playlist",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
