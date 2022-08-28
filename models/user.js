"use strict";
const bcrypt = require("bcryptjs");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Playlist);
      User.hasMany(models.Transaction);
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Username Cannot Be Empty",
          },
          notEmpty: {
            msg: "Username Cannot Be Empty",
          },
          isAlphanumeric: {
            msg: "Username Only Alphanumeric Characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email Cannot Be Empty",
          },
          notEmpty: {
            msg: "Email Cannot Be Empty",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password Cannot Be Empty",
          },
          notEmpty: {
            msg: "Password Cannot Be Empty",
          },
        },
      },
      premium: {
        type: DataTypes.BOOLEAN,
      },
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
        },
      },
      isConfirmed: {
        type: DataTypes.BOOLEAN,
      },
      confirmationCode: {
        type: DataTypes.INTEGER,
      },
      resetCode: {
        type: DataTypes.INTEGER,
      },
      expiredAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      hooks: {
        beforeCreate(user) {
          user.password = bcrypt.hashSync(user.password, 10);
          user.premium = false;
          user.isConfirmed = false;
          user.expiredAt = null;
          user.confirmationCode = Math.floor(1000 + Math.random() * 9000);
          user.resetCode = null;
        },
      },
      modelName: "User",
    }
  );
  return User;
};
