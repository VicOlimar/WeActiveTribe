'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Discount', 'active', Sequelize.BOOLEAN, {
      defaultValue: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Discount', 'active');
  },
};
