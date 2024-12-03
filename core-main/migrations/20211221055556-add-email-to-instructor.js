'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Instructor',
      'email', {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Instructor',
      'email',
    );
  }
};