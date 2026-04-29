'use strict';
const fs = require('fs').promises;
const path = require('path');
 
module.exports = {
  async up(queryInterface) {
    const raw = await fs.readFile(path.join(__dirname, '../data/item-tags.json'), 'utf-8');
    const data = JSON.parse(raw);
 
    const rows = data.map((el) => {
      delete el.id;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });
    await queryInterface.bulkInsert('ItemTags', rows);
  },
 
  async down(queryInterface) {
    await queryInterface.bulkDelete('ItemTags', null, {});
  }
};