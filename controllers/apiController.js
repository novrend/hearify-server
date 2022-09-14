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
        statusCode: 200,
        data: album.body,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
