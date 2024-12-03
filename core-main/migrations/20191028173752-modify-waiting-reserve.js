'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Waiting', 'reserved_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Waiting', 'reserved_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });  },
};
