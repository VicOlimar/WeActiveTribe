'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'BlockedPlace',
      'visible', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'BlockedPlace',
      'visible',
    );
  }
};
