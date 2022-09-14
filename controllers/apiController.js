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

  static async searchSong(req, res, next) {
    try {
      const { q } = req.query;
      const spotifyApi = await spotify();
      const song = await spotifyApi.searchTracks(`track:${q}`);
      res.status(200).json({
        statusCode: 200,
        data: song.body,
      });
    } catch (err) {}
  }

  static async getSong(req, res, next) {
    try {
      const { id } = req.query;
      const spotifyApi = await spotify();
      const song = await spotifyApi.getTracks([id, id, id]);
      res.status(200).json({
        statusCode: 200,
        data: song.body,
      });
    } catch (err) {}
  }

  static async getFeaturedPlaylist(req, res, next) {
    try {
      const spotifyApi = await spotify();
      let playlist = await spotifyApi.getFeaturedPlaylists({
        country: "ID",
        locale: "id_ID",
      });
      playlist = {
        message: playlist.body.message,
        playlists: playlist.body.playlists.items,
      };
      res.status(200).json({
        statusCode: 200,
        data: playlist,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPlaylistByGenre(req, res, next) {
    try {
      const { name } = req.query;
      const spotifyApi = await spotify();
      const playlist = await spotifyApi.searchPlaylists(name, {
        country: "ID",
      });
      res.status(200).json({
        statusCode: 200,
        data: playlist.body,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getGenreList(req, res, next) {
    try {
      const spotifyApi = await spotify();
      const pop = await spotifyApi.searchPlaylists("pop", {
        country: "ID",
        limit: 1,
        offset: 0,
      });
      const rock = await spotifyApi.searchPlaylists("rock", {
        country: "ID",
        limit: 1,
        offset: 0,
      });
      const jazz = await spotifyApi.searchPlaylists("jazz", {
        country: "ID",
        limit: 1,
        offset: 0,
      });
      const kpop = await spotifyApi.searchPlaylists("k-pop", {
        country: "ID",
        limit: 1,
        offset: 0,
      });
      const indie = await spotifyApi.searchPlaylists("indie", {
        country: "ID",
        limit: 1,
        offset: 0,
      });
      const romance = await spotifyApi.searchPlaylists("romance", {
        country: "ID",
        limit: 1,
        offset: 0,
      });
      const blues = await spotifyApi.searchPlaylists("blues", {
        country: "ID",
        limit: 1,
        offset: 0,
      });
      const soul = await spotifyApi.searchPlaylists("soul", {
        country: "ID",
        limit: 1,
        offset: 0,
      });
      const country = await spotifyApi.searchPlaylists("country", {
        country: "ID",
        limit: 1,
        offset: 0,
      });
      const rnb = await spotifyApi.searchPlaylists("r-n-b", {
        country: "ID",
        limit: 1,
        offset: 0,
      });
      const party = await spotifyApi.searchPlaylists("party", {
        country: "ID",
        limit: 1,
        offset: 0,
      });
      const hiphop = await spotifyApi.searchPlaylists("hip-hop", {
        country: "ID",
        limit: 1,
        offset: 0,
      });
      res.status(200).json({
        statusCode: 200,
        data: {
          pop: pop.body.playlists.items[0].images[0].url,
          rock: rock.body.playlists.items[0].images[0].url,
          jazz: jazz.body.playlists.items[0].images[0].url,
          kpop: kpop.body.playlists.items[0].images[0].url,
          indie: indie.body.playlists.items[0].images[0].url,
          romance: romance.body.playlists.items[0].images[0].url,
          blues: blues.body.playlists.items[0].images[0].url,
          soul: soul.body.playlists.items[0].images[0].url,
          country: country.body.playlists.items[0].images[0].url,
          rnb: rnb.body.playlists.items[0].images[0].url,
          party: party.body.playlists.items[0].images[0].url,
          hiphop: hiphop.body.playlists.items[0].images[0].url,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async findPlaylist(req, res, next) {
    try {
      const { genre } = req.query;
      const spotifyApi = await spotify();
      const playlist = await spotifyApi.searchPlaylists(genre, {
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
}

module.exports = Controller;
