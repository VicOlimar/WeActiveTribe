'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Lesson', 'instructor_id');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Lesson', 'instructor_id', {
      type: Sequelize.INTEGER,
    });
  }
};
