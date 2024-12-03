'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Discount',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        code: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        total_uses: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        discount: {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM('percentage', 'amount'),
          allowNull: false,
          defaultValue: 'percentage',
        },
        expires_after: {
          type: Sequelize.DATE,
          allowNull: true,
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
    return queryInterface.dropTable('Discount');
  },
};
