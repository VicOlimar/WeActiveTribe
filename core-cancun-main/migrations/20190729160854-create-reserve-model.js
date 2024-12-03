'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Reserve',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        canceled: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        reserved_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        lesson_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Lesson',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          foreignKey: true,
        },
        credit_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Credit',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          foreignKey: true,
        },
        place_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Place',
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
    return queryInterface.dropTable('Reserve');
  },
};
