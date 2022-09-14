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
        unique: {
          msg: "Username must be unique",
        },
        validate: {
          notNull: {
            msg: "Username cannot be empty",
          },
          notEmpty: {
            msg: "Username cannot be empty",
          },
          isAlphanumeric: {
            msg: "Username only alphanumeric characters",
          },
          len: {
            args: [1, 20],
            msg: "Max length is 20 characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email must be unique",
        },
        validate: {
          notNull: {
            msg: "Email cannot be empty",
          },
          notEmpty: {
            msg: "Email cannot be empty",
          },
          isEmail: {
            msg: "Worng email format",
          },
          len: {
            args: [1, 64],
            msg: "Max length is 64 characters",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password cannot be empty",
          },
          notEmpty: {
            msg: "Password cannot be empty",
          },
          len: {
            args: [6, 32],
            msg: "Input 6-32 characters",
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
            msg: "Name cannot be empty",
          },
          notEmpty: {
            msg: "Name cannot be empty",
          },
          len: {
            args: [1, 64],
            msg: "Max length is 64 characters",
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
    },
    {
      sequelize,
      hooks: {
        beforeCreate(user) {
          user.password = bcrypt.hashSync(user.password, 10);
          user.premium = false;
          user.isConfirmed = false;
          user.confirmationCode = Math.floor(1000 + Math.random() * 9000);
          user.resetCode = null;
        },
      },
      modelName: "User",
    }
  );
  return User;
};
