'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Profile', 'phone', Sequelize.STRING, {
      after: 'locale', // after option is only supported by MySQL
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Profile', 'phone');
  },
};
