'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Plan',
      'credit_type',
      {
        type: Sequelize.ENUM('classic', 'online'),
        allowNull: false,
        defaultValue: 'classic',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Plan',
      'credit_type',
    );
  }
};
