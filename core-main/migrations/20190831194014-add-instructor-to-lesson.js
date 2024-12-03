module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Lesson', 'instructor_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Instructor',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Lesson', 'instructor_id');
  },
};
