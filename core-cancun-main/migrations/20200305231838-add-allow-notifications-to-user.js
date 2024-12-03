'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Profile', 'notifications', Sequelize.BOOLEAN, {
      defaultValue: 1
    });

    return queryInterface.sequelize.query(
      `UPDATE "Profile" SET notifications= :notifications;`,
      {
        replacements: { notifications: true },
        type: queryInterface.sequelize.QueryTypes.UPDATE
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Profile', 'notifications');
  },
};
