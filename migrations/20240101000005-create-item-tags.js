'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ItemTags', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      ItemId: {
        type: Sequelize.INTEGER,
        references: { model: 'Items', key: 'id' },
        onDelete: 'CASCADE'
      },
      TagId: {
        type: Sequelize.INTEGER,
        references: { model: 'Tags', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('ItemTags');
  }
};
