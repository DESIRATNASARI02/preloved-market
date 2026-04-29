'use strict';
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
 
module.exports = {
  async up(queryInterface) {
    const raw = await fs.readFile(path.join(__dirname, '../data/users.json'), 'utf-8');
    const data = JSON.parse(raw);
 
    const users = await Promise.all(
      data.map(async (el) => {
        delete el.id;
        el.password = await bcrypt.hash(el.password, 10);
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      })
    );
    await queryInterface.bulkInsert('Users', users);
  },
 
  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};