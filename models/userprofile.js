'use strict';
const { Model } = require('sequelize');
 
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    //  Instance method / getter
    get displayName() {
      return this.name || 'Pengguna';
    }
 
    static associate(models) {
      UserProfile.belongsTo(models.User, { foreignKey: 'UserId' });
    }
  }
 
  UserProfile.init({
    UserId: { type: DataTypes.INTEGER },
    name: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: 'Nama tidak boleh kosong' } }
    },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    bio: { type: DataTypes.TEXT }
  }, {
    sequelize,
    modelName: 'UserProfile'
  });
 
  return UserProfile;
};