require('dotenv').config();

import { log } from './libraries/Log';
import { setupDB } from './db';
import { setupServer } from './server';
import JanitorService from './services/JanitorService';
import * as notifier from 'node-notifier';
import { Op } from 'sequelize';
import { Charge } from './models/Charge';
import { User } from './models/User';
import { Lesson } from './models/Lesson';
import { Waiting } from './models/Waiting';
import { Reserve } from './models/Reserve';
import { Credit } from './models/Credit';
import { asyncForEach } from './libraries/util';
import * as moment from 'moment-timezone';
import { OnlineCredit } from './models/OnlineCredit';
import { Plan } from './models/Plan';
import { Instructor } from './models/Instructor';
import { NewCreditsService } from './services/NewCreditsService';

process.env.TZ = 'UTC'; // IMPORTANT For correct timezone management with DB, Tasks etc.

const tasks = {
  'decline-first-users': async (charge_id: string) => {
    const charge = await Charge.findByPk(parseInt(charge_id));
    const user = await charge.$get('user') as User;
    await user.sendPurchaseFailureEmail(charge);
  },
  'add-credits': async (charge_id: string) => {
    const charge = await Charge.findByPk(parseInt(charge_id));
    const user = await charge.$get('user') as User;
    await user.addCredits(charge);
  },
  'info-lesson': async (lesson_id: string) => {
    const lesson = await Lesson.findByPk(parseInt(lesson_id));
    await lesson.sendInfoEmail();
  },
  'restaure-credit': async (lesson_id: string) => {
    await Waiting.destroy({ where: { lesson_id } });
    const reserves = await Reserve.findAll({ where: { lesson_id } });
    await asyncForEach(reserves, async (reserve) => {
      await Reserve.updateCredit(reserve);
      await reserve.destroy();
    });
  },
  'core-cycle-missing': async () => {
    const emails = [
      'christineschulte04@gmail.com',
      'ANYORA@GMAIL.COM',
      'ANAPAULINAG.ALTAMIRANO@GMAIL.COM',
      'naadyeli@gmail.com',
    ];

    await Promise.all(
      emails
        .map(e => e.toLowerCase())
        .map(async (email: string) => {
          const user = await User.findOne({ where: { email } });
          await NewCreditsService.call(user);
        }),
    );
  },
  'disable-covid': async (lesson_id: string) => {
    console.log('Proceso iniciado...');

    const initial_date = "2020-09-25T06:00:00.00Z";
    const final_date = "2020-10-06T06:00:00.00Z";

    console.log('Obteniendo los creditos...');
    const time_since = moment(final_date).diff(moment(initial_date), 'days');
    const credits = await Credit.findAll({
      where: {
        expires_at: {
          [Op.between]: [initial_date, final_date]
        }
      }
    });

    console.log('Actualizando créditos...');
    const after_credits = credits.map((credit) => {
      const new_date = moment(credit.expires_at)
        .add(time_since, 'days')
        .toDate();
      credit.expires_at = new_date;
      return credit.save();
    });

    await Promise.all(after_credits);

    console.log('Proceso terminado.')
  },
  'update-plans-expirations': async () => {
    console.log('Actualizando planes...')
    const initial_date = moment("2019-01-01T06:00:00.00Z").toDate();

    const charges = await Charge.findAll({
      where: {
        created_at: {
          [Op.gte]: initial_date
        }
      },
      include: [{
        model: Credit,
        as: 'credits'
      }, {
        model: OnlineCredit,
        as: 'online_credits'
      }]
    });

    await asyncForEach(charges, async (charge: Charge) => {
      let new_expirtation_date = new Date();
      if (charge.credits.length > 0) {
        new_expirtation_date = charge.credits[0].expires_at;
        await charge.update({
          expires_at: new_expirtation_date
        });
      } else if (charge.online_credits.length > 0) {
        new_expirtation_date = charge.online_credits[0].expires_at;
        await charge.update({
          expires_at: new_expirtation_date
        });
      }
    });

    console.log('Fecha de expiración de las compras actualizada');
  },
  'send-expiration-email': async (daysAfterExpires: number) => {
    console.log('Obteniendo las compras próximas a expirar');
    const startDate = moment().startOf('day').add(daysAfterExpires, 'days');
    const endDate = moment().endOf('day').add(daysAfterExpires, 'days');
    const charges = await Charge.findAll({
      include: [
        User,
        {
          model: Credit,
          as: 'credits',
          where: { used: false }
        }
      ],
      where: {
        status: 'paid',
        expires_at: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
    console.log(`Enviando un total de ${charges.length} notificaciones`);
    asyncForEach(charges, (charge: Charge) => {
      const user = charge.user;
      if (charge.credits.length > 0) {
        user.sendExpiresCredits(charge.credits.length, charge.plan_name, charge.expires_at);
      }
    });
    console.log('Notificaciones enviadas.');
  },
  'update-covid-expirations': async (lesson_id: string) => {
    console.log('Proceso iniciado...');

    const daysOutAfterSecondClose = 4;
    const initial_date = "2020-03-15T06:00:00.00Z";
    const final_date = "2020-10-06T06:00:00.00Z";

    console.log('Actualizando compras que se hicieron durante el cierre.');
    let charges = await Charge.findAll({
      where: {
        created_at: {
          [Op.between]: [initial_date, final_date],
        }
      },
      include: [{
        model: Credit,
        as: 'credits',
      }]
    });

    console.log(`Se actualizarán un total de ${charges.length} compras.`);
    asyncForEach(charges, async (charge: Charge) => {
      const credits = charge.credits;
      const time_since = moment(charge.expires_at).diff(moment(charge.created_at), 'days');
      const plan = await Plan.findOne({
        where: {
          name: charge.plan_name,
        }
      });

      if (time_since > 0) {
        const new_date = moment(final_date)
          .add(time_since, 'days')
          .toDate();

        await asyncForEach(credits, async (credit: Credit) => {
          credit.expires_at = new_date;
          await credit.save();
        });
        charge.expires_at = new_date;
        await charge.save();
      }
    });

    console.log('Proceso terminado.');

    console.log('Actualizando créditos de planes de un año.');
    charges = await Charge.findAll({
      where: {
        created_at: {
          [Op.lte]: initial_date,
        }
      },
      include: [{
        model: Credit,
        as: 'credits',
      }]
    });

    console.log(`Se actualizarán un total de ${charges.length} compras.`);
    asyncForEach(charges, async (charge: Charge) => {
      const credits = charge.credits;
      const time_since = moment(initial_date).diff(moment(charge.created_at), 'days');
      const plan = await Plan.findOne({
        where: {
          name: charge.plan_name,
        }
      });
      if (plan) {
        const new_date = moment(final_date)
          .add(plan.expires_numbers - time_since - daysOutAfterSecondClose, 'days')
          .toDate();

        await asyncForEach(credits, async (credit: Credit) => {
          credit.expires_at = new_date;
          await credit.save();
        });
        charge.expires_at = new_date;
        await charge.save();
      } else {
        console.log(`No se encontró el plan original para el cargo ${charge.id}`);
      }

    });
    console.log('Proceso terminado.');
  },
  'merge-users': async (emails: string) => {
    const emailsToUse = emails.split(',');
    const firstEmail = emailsToUse[0];
    const secondEmail = emailsToUse[1];
    try {
      const oldUser = await User.findOne({
        where: {
          email: firstEmail
        }
      });
      const activeUser = await User.findOne({
        where: {
          email: secondEmail
        }
      });

      // Update charges assigned to old user
      await Charge.update({
        user_id: activeUser.id,
      }, {
        where: {
          user_id: oldUser.id
        }
      });

      // Update reserves assigned to old user
      await Reserve.update({
        user_id: activeUser.id,
      }, {
        where: {
          user_id: oldUser.id
        }
      });

      // Update credits assigned to old user
      await Credit.update({
        user_id: activeUser.id,
      }, {
        where: {
          user_id: oldUser.id
        }
      });

      // Update online credits assigned to old user
      await OnlineCredit.update({
        user_id: activeUser.id,
      }, {
        where: {
          user_id: oldUser.id
        }
      });

      console.log(`Se ha asignado toda la información del usuario ${oldUser.email} a ${activeUser.email}`);
    } catch (error) {
      console.log('Ocurrió un error');
      console.log(error);
    }
  },
  'admin': async () => {
    try {
      const user = await User.findOne({
        where: {
          email: "administracion@weactive.mx"
        }
      });

      user.role = "admin";

      await user.save();

      console.log(`Actualizado`);
    } catch (error) {
      console.log('Ocurrió un error');
      console.log(error);
    }
  },
  'send-miss-you-email': async (daysAfterExpires: number) => {
    console.log('Enviando correos a usuarios inactivos');
    const lastMonth = moment().subtract(1, 'months');
    const lastTwoMonths = moment().subtract(2, 'months');
    const users = await User.findAll({
      where: {
        [Op.or]: [{
          last_contact_date: {
            [Op.lte]: lastMonth
          }
        }, {
          last_contact_date: null
        }],
      }
    })

    await asyncForEach(users, async (user: User) => {
      const recentReserves = await Reserve.findAll({
        where: {
          user_id: user.id,
          canceled: false,
          reserved_at: {
            [Op.gt]: lastMonth
          }
        }
      });
      const reserves = await Reserve.findAll({
        where: {
          user_id: user.id,
          canceled: false,
          reserved_at: {
            [Op.between]: [lastTwoMonths, lastMonth]
          }
        }
      });
      if (reserves.length > 0 && recentReserves.length === 0) {
        console.log(`Notify user: ${user.email}`);
        await user.sendMissYouEmail();
        await user.update({
          last_contact_date: new Date()
        });
      }
    });
  },
  'send-list': async () => {

    const initial_date = moment().locale('America/Merida').format();
    const final_date = moment().locale('America/Merida').add('10', 'minutes').format();

    const classReminder = await Lesson.findAll({
      where: {
        starts_at: { 
          [Op.between]: [initial_date, final_date]
        },
      },
      include: [{model: Instructor}]
    });

    console.log("Enviando recordatorios");

    let allReminders = classReminder.map(async (reminder)=> {
      reminder.classReminder();
    });

    await Promise.all(allReminders);

    console.log("Recordatorios enviados");
  },
  'add-users-mailchimp': async (daysAfterExpires: number) => {
    console.log('Agregando usuarios a mailchimp .....');
    const users = await User.findAll({
      where: {
        role: "user"
      }
    })
    console.log(users.length, " usuarios ....")
    await asyncForEach(users, async (user: User) => {
      await user.mailchimpRegister();
    });
    console.log(users.length, "Carga finalizada.")
  },
  'add-admin': async () => {
    console.log("Creando admin...")
    let newUser = {
      email: "dev@coati.com",
      password: "12345678",
      name: "DEV",
      last_name: "Coati",
      role: "admin"
    } as User;

    try {
      newUser = await User.create(newUser);
      console.log("Success add ddmin ")
    } catch (err) {
      console.log("Error add admin")
    }
    finally {
      console.log("End task")
    }
  }
};

(async () => {
  try {
    await setupDB();
    const task = process.argv[2];
    if (tasks.hasOwnProperty(task)) {
      await tasks[task](process.argv[3]);
    }
  } catch (error) {
    log.error(error);
  }
})();
