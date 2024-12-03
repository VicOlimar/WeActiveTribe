'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Plan',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        price: {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
        credits: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        expires_numbers: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        expires_unit: {
          type: Sequelize.ENUM('years', 'months', 'days'),
          allowNull: false,
          defaultValue: 'months',
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        charset: 'utf8',
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Plan');
  },
};
