'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PaymentCustomer', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      payment_key: {
        type: Sequelize.STRING,
        allowNull: false
      },
      payment_gateway: {
        type: Sequelize.ENUM('conekta', 'stripe'),
        allowNull: false
      },
      profile_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Profile',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add index for faster queries
    await queryInterface.addIndex('PaymentCustomer', ['profile_id', 'payment_gateway']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PaymentCustomer');
  }
};