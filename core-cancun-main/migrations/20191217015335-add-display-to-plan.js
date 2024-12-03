'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Plan', 'active', {
      type: Sequelize.BOOLEAN,
      default: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Plan', 'active');
  }
};
