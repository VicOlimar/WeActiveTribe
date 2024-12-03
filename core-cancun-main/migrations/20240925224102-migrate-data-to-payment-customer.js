'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Migrate existing payment_key data to PaymentCustomer table
    const profiles = await queryInterface.sequelize.query(
      'SELECT id, payment_key FROM "Profile" WHERE payment_key IS NOT NULL',
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const profile of profiles) {
      await queryInterface.bulkInsert('PaymentCustomer', [{
        payment_key: profile.payment_key,
        payment_gateway: 'conekta', // Assuming all existing keys are for Conekta
        profile_id: profile.id,
        created_at: new Date(),
        updated_at: new Date()
      }]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Migrate data back to Profiles table
    const PaymentCustomer = await queryInterface.sequelize.query(
      'SELECT payment_key, profile_id FROM "PaymentCustomer" WHERE payment_gateway = \'conekta\'',
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const customer of PaymentCustomer) {
      await queryInterface.sequelize.query(
        'UPDATE "Profile" SET payment_key = ? WHERE id = ?',
        {
          replacements: [customer.payment_key, customer.profile_id],
          type: Sequelize.QueryTypes.UPDATE
        }
      );
    }
  }
};