'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Credit',
        'paused', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        }
      ),
      queryInterface.addColumn(
        'Credit',
        'validity', {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0
        }
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        'Credit',
        'paused',
      ),
      queryInterface.removeColumn(
        'Credit',
        'validity',
      ),
    ]);
  }
};
