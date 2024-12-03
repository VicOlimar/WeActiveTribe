'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove payment_key from Profiles table
    await queryInterface.removeColumn('Profile', 'payment_key');
  },

  down: async (queryInterface, Sequelize) => {
    // Add payment_key back to Profiles table
    await queryInterface.addColumn('Profile', 'payment_key', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};