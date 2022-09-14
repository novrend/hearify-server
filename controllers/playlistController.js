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
      let songs = playlist.map((el) => el.songId);
      const spotifyApi = await spotify();
      const song = await spotifyApi.getTracks(songs);
      song.body.tracks.forEach((el, i) => {
        el.disc_number = playlist[i].id;
      });
      song.body.playlist = playlist[0].Playlist;
      res.status(200).json({
        statusCode: 200,
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
        statusCode: 200,
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
        statusCode: 201,
        message: "Success add song to your playlist",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
