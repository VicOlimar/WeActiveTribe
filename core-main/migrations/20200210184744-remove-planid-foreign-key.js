'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const charges = await queryInterface.sequelize.query(
      `SELECT id, plan_id from "Charge"`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    const chargesUpdates = charges.map(async (charge) => {

      const plan_name_query = await queryInterface.rawSelect('Plan', { where: { id: charge.plan_id } }, ['name']);
      const plan_name = plan_name_query === null ? 'courtesy' : plan_name_query;

      return queryInterface.sequelize.query(
        `UPDATE "Charge" SET plan_name= :plan_name WHERE id= :charge_id;`,
        {
          replacements: { plan_name: plan_name, charge_id: charge.id },
          type: queryInterface.sequelize.QueryTypes.UPDATE
        }
      );
    });
    chargesUpdates.push(queryInterface.removeColumn('Charge', 'plan_id'));
    return Promise.all(chargesUpdates);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Charge', 'plan_id',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Plan',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        foreignKey: true,
        allowNull: true,
      }
    );
  }
};
