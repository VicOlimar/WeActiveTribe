'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'OnlineCredit',
        'paused', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        }
      ),
      queryInterface.addColumn(
        'OnlineCredit',
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
        'OnlineCredit',
        'paused',
      ),
      queryInterface.removeColumn(
        'OnlineCredit',
        'validity',
      ),
    ]);
  }
};
