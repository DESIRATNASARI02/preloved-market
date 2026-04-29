'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserProfiles', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      UserId: {
        type: Sequelize.INTEGER,
        unique: true, // One-to-One
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      name: { type: Sequelize.STRING },
      phone: { type: Sequelize.STRING },
      address: { type: Sequelize.TEXT },
      bio: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('UserProfiles');
  }
};
