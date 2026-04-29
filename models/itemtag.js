'use strict';
const { Model } = require('sequelize');
 
module.exports = (sequelize, DataTypes) => {
  class ItemTag extends Model {
    static associate(models) {}
  }
 
  ItemTag.init({
    ItemId: { type: DataTypes.INTEGER },
    TagId: { type: DataTypes.INTEGER }
  }, {
    sequelize,
    modelName: 'ItemTag'
  });
 
  return ItemTag;
};