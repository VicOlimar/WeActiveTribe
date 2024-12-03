'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Charge', 'plan_name', {
      type: Sequelize.STRING,
      allowNull: true
    }); 
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn('Charge', 'plan_name');
  }
};
