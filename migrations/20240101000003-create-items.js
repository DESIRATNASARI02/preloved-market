'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Items', {
      id: { 
        allowNull: false, 
        autoIncrement: true, 
        primaryKey: true, 
      type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      price: { type: Sequelize.INTEGER, allowNull: false },
      stock: { type: Sequelize.INTEGER, defaultValue: 1 },
      condition: {
        type: Sequelize.ENUM('new', 'like_new', 'good', 'fair'),
        defaultValue: 'good'
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Items');
  }
};
