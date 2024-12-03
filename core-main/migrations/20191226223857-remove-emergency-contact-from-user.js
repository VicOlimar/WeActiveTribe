'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // logic for transforming into the new state
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'User',
      'emergency_contact'
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('User', 'emergency_contact', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
