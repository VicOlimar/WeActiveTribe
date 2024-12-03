'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Lesson',
      'lesson_type_id',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'LessonType',
          key: 'id'
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Lesson',
      'lesson_type_id',
    );
  }
};
