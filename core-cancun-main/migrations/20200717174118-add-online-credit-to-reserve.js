'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Reserve',
      'online_credit_id',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'OnlineCredit',
          key: 'id'
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Reserve',
      'online_credit_id',
    );
  }
};
