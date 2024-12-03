'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('LessonType', [
      {
        name: 'Two Tribes One Soul',
      },
      {
        name: 'We Kids',
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('LessonType', null, {});
  },
};
