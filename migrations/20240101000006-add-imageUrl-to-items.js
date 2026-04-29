'use strict';

// Additional migration (add column)
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Items', 'imageUrl', {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Items', 'imageUrl');
  }
};
