'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Charge', 'discount_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Discount',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      foreignKey: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Charge', 'discount_id');
  },
};
