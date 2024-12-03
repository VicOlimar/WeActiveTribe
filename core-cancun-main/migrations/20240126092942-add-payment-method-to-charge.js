module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Charge', 'payment_method', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'conekta',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Charge', 'payment_method');
  },
};
