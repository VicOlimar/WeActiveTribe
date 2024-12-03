'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Credit',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        used: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        expires_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        charge_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Charge',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          foreignKey: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'User',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          foreignKey: true,
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
    return queryInterface.dropTable('Credit');
  },
};
