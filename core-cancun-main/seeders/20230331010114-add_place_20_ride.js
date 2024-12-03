'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const weRideSlug = 'we-ride';
    const place = 20;
    const weRideStudioRows = await queryInterface.sequelize.query(
      `SELECT id from "Studio" WHERE slug= :slug;`,
      {
        replacements: { slug: weRideSlug },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    if (weRideStudioRows[0]) { 
      return queryInterface.bulkInsert('Place',[
        {
          location: place,
          studio_id: weRideStudioRows[0].id,
        }
      ]);
    }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Place', null, {});
  }
};
