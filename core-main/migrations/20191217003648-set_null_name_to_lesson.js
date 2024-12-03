'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Lesson', 'name', Sequelize.STRING, {
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Lesson', 'name', Sequelize.STRING, {
      allowNull: false,
    });
  },
};
