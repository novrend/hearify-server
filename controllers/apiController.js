const spotify = require("../helpers/spotifyApi");
const fetch = require("node-fetch");

class Controller {
  static async getAlbumDetail(req, res, next) {
    try {
      const { albumId } = req.query;
      if (!albumId) {
        res.status(401).json({
          statusCode: 401,
          message: "Album Id Cannot Be Empty",
        });
      }
      const spotifyApi = await spotify();
      const album = await spotifyApi.getAlbum(albumId);
      res.status(200).json({
        statusCode: 200,
        data: album,
      });
    } catch (err) {
      next(err);
    }
  }

  static async searchSong(req, res, next) {
    try {
      const { q } = req.query;
      if (!q) {
        res.status(401).json({
          statusCode: 401,
          message: "Search Cannot Be Empty",
        });
      }
      const spotifyApi = await spotify();
      const song = await spotifyApi.searchTracks(`track:${q}`);
      res.status(200).json({
        statusCode: 200,
        data: song,
      });
    } catch (err) {}
  }

  static async getArtistDetail(req, res, next) {
    try {
      const { artistId } = req.query;
      if (!artistId) {
        res.status(401).json({
          statusCode: 401,
          message: "Artist Id Cannot Be Empty",
        });
      }
      const spotifyApi = await spotify();
      const artist = await spotifyApi.getArtist(artistId);
      res.status(200).json({
        statusCode: 200,
        data: artist,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPlaylistByGenre(req, res, next) {
    try {
      const spotifyApi = await spotify();
      const pop = await spotifyApi.getPlaylistsForCategory("pop", {
        country: "ID",
      });
      const rock = await spotifyApi.getPlaylistsForCategory("rock", {
        country: "ID",
      });
      const jazz = await spotifyApi.getPlaylistsForCategory("jazz", {
        country: "ID",
      });
      const dance = await spotifyApi.getPlaylistsForCategory("dance", {
        country: "ID",
      });
      res.status(200).json({
        statusCode: 200,
        data: {
          pop,
          rock,
          jazz,
          dance,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getFeaturedPlaylist(req, res, next) {
    try {
      const spotifyApi = await spotify();
      const playlist = await spotifyApi.getFeaturedPlaylists({
        country: "ID",
        locale: "id_ID",
      });
      res.status(200).json({
        statusCode: 200,
        data: playlist,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getGenreList(req, res, next) {
    try {
      const spotifyApi = await spotify();
      const genres = await spotifyApi.getAvailableGenreSeeds();
      res.status(200).json({
        statusCode: 200,
        data: genres,
      });
    } catch (err) {
      next(err);
    }
  }

  static async findPlaylist(req, res, next) {
    try {
      const { genre } = req.query;
      if (!genre) {
        res.status(401).json({
          statusCode: 401,
          message: "Genre Cannot Be Empty",
        });
      }
      const spotifyApi = await spotify();
      const playlist = await spotifyApi.getPlaylistsForCategory(genre, {
        country: "ID",
      });
      res.status(200).json({
        statusCode: 200,
        data: playlist,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getBSCTrx(req, res, next) {
    try {
      let response = await fetch(
        `https://api.bscscan.com/api?module=account&action=txlist&address=${process.env.BSC_ADDRESS}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${process.env.APIKEY_BSC}`,
        { method: "GET" }
      );
      response = await response.json();
      res.status(200).json({
        statusCode: 200,
        data: response.result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
