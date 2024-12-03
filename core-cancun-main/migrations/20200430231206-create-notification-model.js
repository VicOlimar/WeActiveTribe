'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Notification',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        api_id: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        },
        subtitle: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        },
        content: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
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
    return queryInterface.dropTable('Notification');
  },
};
