'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
 
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Static method
    static async findByEmail(email) {
      return await User.findOne({ where: { email } });
    }
 
    //Instance method - check password
    checkPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
 
    // Instance method - role label
    getRoleLabel() {
      return this.role === 'seller' ? '🛍️ Seller' : '🛒 Buyer';
    }
 
    static associate(models) {
      // One-to-One
      User.hasOne(models.UserProfile, { foreignKey: 'UserId' });
      // One-to-Many
      User.hasMany(models.Item, { foreignKey: 'UserId' });
    }
  }
 
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Email sudah digunakan' },
      validate: {
        notEmpty: { msg: 'Email tidak boleh kosong' },
        isEmail: { msg: 'Format email tidak valid' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password tidak boleh kosong' },
        len: { args: [6, 100], msg: 'Password minimal 6 karakter' }
      }
    },
    role: {
      type: DataTypes.ENUM('buyer', 'seller'),
      defaultValue: 'buyer',
      validate: {
        isIn: { args: [['buyer', 'seller']], msg: 'Role harus buyer atau seller' }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      // Hook - hash password sebelum create
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });
 
  return User;
};