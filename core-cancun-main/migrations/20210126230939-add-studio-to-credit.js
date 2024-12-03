'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Credit',
      'studio_id',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Studio',
          key: 'id'
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Credit',
      'studio_id',
    );
  }
};
