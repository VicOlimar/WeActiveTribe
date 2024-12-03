'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('User', 'active', {
      type: Sequelize.BOOLEAN,
      default: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('User', 'active');
  }
};
