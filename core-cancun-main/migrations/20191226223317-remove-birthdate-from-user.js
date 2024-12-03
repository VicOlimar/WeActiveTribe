'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // logic for transforming into the new state
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'User',
      'birthdate'
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('User', 'birthdate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
};
