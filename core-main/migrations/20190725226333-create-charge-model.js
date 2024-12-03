'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Charge',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        paid: {
          type: Sequelize.DECIMAL,
          allowNull: false,
        },
        total_credits: {
          type: Sequelize.DECIMAL,
          allowNull: false,
        },
        expires_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        processed_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        plan_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Plan',
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
    return queryInterface.dropTable('Charge');
  },
};
