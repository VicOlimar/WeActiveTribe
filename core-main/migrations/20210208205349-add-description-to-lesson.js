'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Lesson',
      'description',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Lesson',
      'description',
    );
  }
};
