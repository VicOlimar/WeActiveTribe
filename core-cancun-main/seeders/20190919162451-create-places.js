'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const places = [];

    const weRideSlug = 'we-ride';
    const weRidePlacesNumber = 19;


    const weRideStudioRows = await queryInterface.sequelize.query(
      `SELECT id from "Studio" WHERE slug= :slug;`,
      {
        replacements: { slug: weRideSlug },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    if (weRideStudioRows[0]) {
      for (let i = 1; i <= weRidePlacesNumber; i++) {
        places.push({
          location: i,
          studio_id: weRideStudioRows[0].id,
        });
      }
    }

    return queryInterface.bulkInsert('Place', places);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Place', null, {});
  }
};
