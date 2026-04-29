'use strict';
const { Model } = require('sequelize');
const { formatRupiah } = require('../helpers/format');
 
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    //  getter
    get formattedPrice() {
      return formatRupiah(this.price);
    }
 
    getConditionLabel() {
      const labels = { new: 'Baru', like_new: 'Seperti Baru', good: 'Bagus', fair: 'Cukup' };
      return labels[this.condition] || this.condition;
    }
 
    static associate(models) {
      Item.belongsTo(models.User, { foreignKey: 'UserId' });
      //  Many-to-Many
      Item.belongsToMany(models.Tag, { through: models.ItemTag, foreignKey: 'ItemId' });
    }
  }
 
  Item.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nama item tidak boleh kosong' },
        len: { args: [3, 100], msg: 'Nama item 3-100 karakter' }
      }
    },
    description: { type: DataTypes.TEXT },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Harga tidak boleh kosong' },
        min: { args: [0], msg: 'Harga tidak boleh negatif' }
      }
    },
    stock: { type: DataTypes.INTEGER, defaultValue: 1 },
    condition: {
      type: DataTypes.ENUM('new', 'like_new', 'good', 'fair'),
      defaultValue: 'good'
    },
    imageUrl: { type: DataTypes.STRING },
    UserId: { type: DataTypes.INTEGER }
  }, {
    sequelize,
    modelName: 'Item'
  });
 
  return Item;
};