'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Profile',
      'payment_key',
      Sequelize.STRING,
      {
        after: 'phone', // after option is only supported by MySQL
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Profile', 'payment_key');
  },
};
