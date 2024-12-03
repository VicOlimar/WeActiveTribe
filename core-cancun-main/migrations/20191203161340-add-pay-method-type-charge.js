'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Charge',
      'payment_type',
      {
        type: Sequelize.ENUM('conekta', 'paypal', 'cash', 'credit-card', 'courtesy'),
        allowNull: false,
        defaultValue: 'conekta',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Charge',
      'payment_type',
    );
  }
};
