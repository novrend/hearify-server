const { Playlist, PlaylistSong } = require("../models");
const spotify = require("../helpers/spotifyApi");

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
        message: "Playlist created successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPlaylistDetail(req, res, next) {
    try {
      const { playlistId } = req.params;
      let playlist = await PlaylistSong.findAll({
        where: {
          PlaylistId: playlistId,
        },
        include: {
          model: Playlist,
        },
      });
      let song = "";
      if (playlist.length) {
        let songs = playlist.map((el) => el.songId);
        const spotifyApi = await spotify();
        song = await spotifyApi.getTracks(songs);
        song.body.tracks.forEach((el, i) => {
          el.disc_number = playlist[i].id;
        });
        song.body.playlist = playlist[0].Playlist;
      } else {
        song = {
          body: [],
        };
      }
      res.status(200).json({
        data: song.body,
      });
    } catch (err) {
      next(err);
    }
  }

  static async editPlaylist(req, res, next) {
    try {
      const { filename } = req.file;
      const { name } = req.body;
      const { playlistId } = req.params;
      await Playlist.update(
        {
          name,
          imageUrl: `${process.env.BASE_URL_SERVER}/image/${filename}`,
        },
        {
          where: {
            id: playlistId,
          },
        }
      );
      res.status(200).json({
        message: "Playlist edited successfully",
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
        songId: songId,
      });
      res.status(201).json({
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
          id: songId,
        },
      });
      res.status(200).json({
        message: "Success delete song from your playlist",
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
      res.status(200).json({
        statusCode: 200,
        message: "Playlist deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
