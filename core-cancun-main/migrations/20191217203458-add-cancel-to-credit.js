'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Credit', 'canceled', {
      type: Sequelize.BOOLEAN,
      default: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Credit', 'canceled');
  }
};
