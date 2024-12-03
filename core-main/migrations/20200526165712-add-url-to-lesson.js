'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Lesson', 'meeting_url', Sequelize.STRING, {
      defaultValue: null,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Lesson', 'meeting_url');
  }
};
