'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Studio', [
      {
        name: 'WE RIDE',
        slug: 'we-ride',
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Studio', null, {});
  },
};
