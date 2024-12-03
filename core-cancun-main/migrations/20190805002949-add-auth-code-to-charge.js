'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Charge',
        'error_code',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        {
          after: 'total_credits', // after option is only supported by MySQL
        },
      ),
      queryInterface.addColumn(
        'Charge',
        'order_id',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        {
          after: 'total_credits', // after option is only supported by MySQL
        },
      ),
      queryInterface.addColumn(
        'Charge',
        'currency',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        {
          after: 'total_credits', // after option is only supported by MySQL
        },
      ),
      queryInterface.addColumn(
        'Charge',
        'status',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        {
          after: 'total_credits', // after option is only supported by MySQL
        },
      ),
      queryInterface.addColumn(
        'Charge',
        'customer_name',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        {
          after: 'total_credits', // after option is only supported by MySQL
        },
      ),
      queryInterface.addColumn(
        'Charge',
        'card_last4',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        {
          after: 'total_credits', // after option is only supported by MySQL
        },
      ),
      queryInterface.addColumn(
        'Charge',
        'card_type',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        {
          after: 'total_credits', // after option is only supported by MySQL
        },
      ),
      queryInterface.addColumn(
        'Charge',
        'card_brand',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        {
          after: 'total_credits', // after option is only supported by MySQL
        },
      ),
      queryInterface.addColumn(
        'Charge',
        'auth_code',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        {
          after: 'total_credits', // after option is only supported by MySQL
        },
      ),
      queryInterface.addColumn(
        'Charge',
        'issuer',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        {
          after: 'total_credits', // after option is only supported by MySQL
        },
      ),
      queryInterface.addColumn(
        'Charge',
        'fee',
        {
          type: Sequelize.DECIMAL,
          allowNull: false,
        },
        {
          after: 'total_credits', // after option is only supported by MySQL
        },
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Charge', 'error_code'),
      queryInterface.removeColumn('Charge', 'order_id'),
      queryInterface.removeColumn('Charge', 'currency'),
      queryInterface.removeColumn('Charge', 'status'),
      queryInterface.removeColumn('Charge', 'customer_name'),
      queryInterface.removeColumn('Charge', 'card_last4'),
      queryInterface.removeColumn('Charge', 'card_type'),
      queryInterface.removeColumn('Charge', 'card_brand'),
      queryInterface.removeColumn('Charge', 'auth_code'),
      queryInterface.removeColumn('Charge', 'issuer'),
      queryInterface.removeColumn('Charge', 'fee'),
    ]);
  },
};
