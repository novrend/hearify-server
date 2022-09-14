const SpotifyWebApi = require("spotify-web-api-node");

const spotify = async () => {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID_SPOTIFY,
    clientSecret: process.env.CLIENT_SECRET_SPOTIFY,
  });
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body["access_token"]);
  return spotifyApi;
};

module.exports = spotify;
