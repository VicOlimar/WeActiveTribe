'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Profile', 'emergency_contact_name', {
      type: Sequelize.STRING,
      allowNull: true
    }); 
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn('Profile', 'emergency_contact_name');
  }
};
