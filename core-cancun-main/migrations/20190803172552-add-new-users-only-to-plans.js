'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Plan',
      'new_users_only',
      Sequelize.STRING,
      {
        after: 'expires_unit', // after option is only supported by MySQL
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Plan', 'new_users_only');
  },
};
