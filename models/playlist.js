"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Playlist.belongsTo(models.User);
      Playlist.hasMany(models.PlaylistSong);
    }
  }
  Playlist.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name Cannot Be Empty",
          },
          notEmpty: {
            msg: "Name Cannot Be Empty",
          },
          len: {
            args: [1, 20],
            msg: "Max length is 20 characters",
          },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Image Cannot Be Empty",
          },
          notEmpty: {
            msg: "Image Cannot Be Empty",
          },
          isUrl: {
            msg: "Wrong url format",
          },
        },
      },
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Playlist",
    }
  );
  return Playlist;
};
