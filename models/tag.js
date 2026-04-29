'use strict';
const { Model } = require('sequelize');
 
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      Tag.belongsToMany(models.Item, { through: models.ItemTag, foreignKey: 'TagId' });
    }
  }
  Tag.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'Nama tag tidak boleh kosong' } }
    }
  }, {
    sequelize,
    modelName: 'Tag'
  });
 
  return Tag;
};