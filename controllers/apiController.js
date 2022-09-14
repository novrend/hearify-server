const spotify = require("../helpers/spotifyApi");

class Controller {
  static async getAlbumDetail(req, res, next) {
    try {
      const { albumId } = req.query;
      const spotifyApi = await spotify();
      const album = await spotifyApi.getAlbum(albumId);
      album.body.tracks.items.forEach(
        (el) =>
          (el.album = {
            images: album.body.images,
          })
      );
      res.status(200).json({
        data: album.body,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getNewReleases(req, res, next) {
    try {
      const spotifyApi = await spotify();
      const newRelease = await spotifyApi.getNewReleases();
      res.status(200).json({
        data: newRelease.body.albums.items,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getArtistDetail(req, res, next) {
    try {
      const { artistId } = req.query;
      const spotifyApi = await spotify();
      const artist = await spotifyApi.getArtist(artistId);
      const album = await spotifyApi.getArtistAlbums(artistId);
      const tracks = await spotifyApi.getArtistTopTracks(artistId, "ID");
      let result = [];
      album.body.items.forEach((el) => {
        if (el.available_markets.includes("ID")) {
          result.push(el);
        }
      });
      res.status(200).json({
        data: {
          artist: artist.body,
          albums: result,
          tracks: tracks.body.tracks,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPlaylistDetail(req, res, next) {
    try {
      const { playlistId } = req.query;
      const spotifyApi = await spotify();
      const artist = await spotifyApi.getPlaylist(playlistId);
      res.status(200).json({
        data: artist.body,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
