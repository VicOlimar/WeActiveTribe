'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Lesson', 'description', {
      type: Sequelize.STRING(400),
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Lesson', 'description', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  },
};
