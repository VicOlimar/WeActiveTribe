'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'User',
      'last_contact_date',
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'User',
      'last_contact_date',
    );
  }
};
