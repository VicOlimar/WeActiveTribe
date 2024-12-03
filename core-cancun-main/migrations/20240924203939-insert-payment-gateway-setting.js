module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Setting', [{
      key: 'payment_gateway',
      value: 'stripe',
      created_at: new Date(),
      updated_at: new Date()
    }], {
      ignoreDuplicates: true
    });
  },

  down: async (queryInterface, Sequelize) => null,
};
