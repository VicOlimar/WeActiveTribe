'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const plans = await queryInterface.sequelize.query(
      `SELECT id, active from "Plan"`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    await queryInterface.addColumn('Plan', 'active_mobile', {
      type: Sequelize.BOOLEAN,
      default: true,
    });

    const plansUpdates = plans.map(async (plan) => {
      return queryInterface.sequelize.query(
        `UPDATE "Plan" SET active_mobile= :active_mobile WHERE id= :plan_id;`,
        {
          replacements: { active_mobile: plan.active, plan_id: plan.id },
          type: queryInterface.sequelize.QueryTypes.UPDATE
        }
      );
    });
    return Promise.all(plansUpdates);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Plan', 'active_mobile');
  }
};
