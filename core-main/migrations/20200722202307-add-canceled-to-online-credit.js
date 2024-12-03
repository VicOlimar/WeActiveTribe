'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('OnlineCredit', 'canceled', {
      type: Sequelize.BOOLEAN,
      default: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('OnlineCredit', 'canceled');
  }
};
