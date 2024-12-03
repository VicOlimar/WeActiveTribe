'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Studio', [
      {
        name: 'WE HIIT ONLINE',
        slug: 'online',
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Studio', null, { where: { slug: 'online' } });
  },
};
