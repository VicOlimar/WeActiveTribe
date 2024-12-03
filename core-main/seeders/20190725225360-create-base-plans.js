
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Plan', [
      {
        name: 'First Class',
        price: 200,
        credits: 2,
        expires_numbers: 30,
        expires_unit: 'days',
        new_users_only: true,
        special: true,
      },
      {
        name: 'Paquete Apertura',
        price: 1500,
        credits: 15,
        expires_numbers: 365,
        expires_unit: 'days',
        new_users_only: true,
        special: true,
      },
      {
        name: '1 Clase',
        price: 200,
        credits: 1,
        expires_numbers: 15,
        expires_unit: 'days',
        new_users_only: false,
      },
      {
        name: '5 Clases',
        price: 900,
        credits: 5,
        expires_numbers: 30,
        expires_unit: 'days',
        new_users_only: false,
      },
      {
        name: '10 Clases',
        price: 1600,
        credits: 10,
        expires_numbers: 60,
        expires_unit: 'days',
        new_users_only: false,
      },
      {
        name: '25 Clases',
        price: 3500,
        credits: 25,
        expires_numbers: 120,
        expires_unit: 'days',
        new_users_only: false,
      },
      {
        name: '50 Clases',
        price: 5900,
        credits: 50,
        expires_numbers: 365,
        expires_unit: 'days',
        new_users_only: false,
      },
      {
        name: '70 Clases',
        price: 7000,
        credits: 70,
        expires_numbers: 365,
        expires_unit: 'days',
        new_users_only: false,
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Plan', null, {});
  },
};
