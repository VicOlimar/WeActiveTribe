import { Reserve } from '../models/Reserve';
import { User } from '../models/User';
import { Credit } from '../models/Credit';
import * as yup from 'yup';
import { Place } from '../models/Place';
import { isNullOrUndefined } from 'util';
import {
  Order,
  OrOperator,
  Op,
  FindAndCountOptions,
  WhereOptions,
} from 'sequelize';
import { BlockedPlace } from '../models/BlockedPlace';
import { Charge } from '../models/Charge';
import { OnlineCredit } from '../models/OnlineCredit';
import { LessonType } from '../models/LessonType';
import { Plan } from '../models/Plan';
import { Studio } from '../models/Studio';
import * as moment from 'moment-timezone';

export function numberFixedLen(n: number, len: number) {
  return (1e4 + '' + n).slice(-len);
}

export function perPage(per_page = 10, page = 1) {
  const limit = +per_page;

  if (isNaN(page) || page < 1) {
    page = 1;
  }

  const offset = limit * (page - 1);

  return { limit, offset };
}

export function sort(sort: string | null = null): Order {
  try {
    const splitted = sort.split(',');

    return splitted.map((item: string) => {
      const split = item.split(' ');
      if (split[0] && split[1]) {
        return [split[0], split[1]];
      } else {
        return null;
      }
    });
  } catch (err) {
    return [['created_at', 'DESC']];
  }
}

export function or(params: string | null = null): OrOperator {
  try {
    return { [Op.or]: params.split(',') };
  } catch (err) {
    return { [Op.or]: [] };
  }
}

export async function findActiveReserve(
  lesson_id: number,
  place_id: number,
): Promise<void> {
  //Validate if Place isn't used
  const reserves = await Reserve.count({
    where: {
      canceled: false,
      lesson_id,
      place_id,
    },
  });

  if (reserves > 0) {
    throw new Error('There is an existing reserve.');
  }
}

export async function findLockedPlace(
  lesson_id: number,
  place_id: number,
): Promise<void> {
  //Validate if Place isn't used
  const lockedPlaces = await BlockedPlace.count({
    where: {
      lesson_id,
      place_id,
    },
  });

  if (lockedPlaces > 0) {
    throw new Error('El lugar está bloqueado.');
  }
}

export async function validateCreditsType(
  lesson_type_id: number,
  user_id: number,
  credits_number: number,
  isOnline: boolean,
) {
  const user = await User.findByPk(user_id);
  let credits: Credit[] | OnlineCredit[] = [];
  const lessonType = await LessonType.findByPk(lesson_type_id);
  const whereOptions: WhereOptions = {
    used: false,
    lesson_type_id: lessonType.id,
    user_id: user.id,
    expires_at: { [Op.gt]: new Date() },
  };

  if (isOnline) {
    credits = await OnlineCredit.findAll({
      where: whereOptions,
    });
  } else {
    credits = await Credit.findAll({
      where: whereOptions,
    });
  }

  if (credits_number > credits.length) {
    throw new Error(
      `No tienes créditos suficientes para este tipo de clase. Compra un paquete para la clase ${lessonType.name}`,
    );
  }
}

export async function validateStudioCredits(
  studio_id: number,
  user_id: number,
  credits_number: number,
) {
  const user = await User.findByPk(user_id);
  const studio = await Studio.findByPk(studio_id);
  const normalCredits = await Credit.count({
    where: {
      used: false,
      user_id: user.id,
      lesson_type_id: null,
      expires_at: { [Op.gt]: new Date() },
    },
  });
  const studioCredits = await Credit.count({
    where: {
      used: false,
      studio_id: studio.id,
      user_id: user.id,
      expires_at: { [Op.gt]: new Date() },
    },
  });

  if (credits_number > studioCredits && credits_number > normalCredits) {
    throw new Error(
      `No tienes créditos suficientes para esta clase. Compra un paquete de clases o un paquete para el estudio ${studio.name}`,
    );
  }
}

export async function useACreditV2(user_id: number, type = 'classic', lesson_type_id: string = null, studio_id: number = null): Promise<Credit | OnlineCredit> {
  const user = await User.findByPk(user_id);
  let credits: Credit[] | OnlineCredit[] = [];
  let studioCredits: Credit[] = [];
  let order: Order = [['expires_at', 'ASC']];
  
  let lesson = await LessonType.findOne({
    attributes:['id'],
    where:{
      name: lesson_type_id
    }
  })
  let idLesson =  lesson !== null ? (await lesson.getDataValue('id')) : null

  let studio = await Studio.findOne({
    attributes:['id'],
    where: {
      name: lesson_type_id
    }
  })
  let idStudio = studio !== null ? (await studio.getDataValue('id')) : null

  if (idStudio !== null) {
    credits = await user.$get('available_credits', {order, where: { studio_id: idStudio }}) as Credit[]
  } else if (idLesson !== null) {
    credits = (await user.$get('available_credits', {order, where:{ lesson_type_id: idLesson}})) as Credit[]
  } else {
    credits = (await user.$get('available_credits', {order, where: { lesson_type_id: null, studio_id: null}})) as Credit[]
  }

  if (credits.length === 0 && studioCredits.length === 0)
    throw new Error("No cuentas con clases disponibles para este estudio o tipo de clase");

  let credit = credits.shift();

  if (credit) {
    credit.used = true;
    credit = await credit.save();
  }

  return credit;
}


export async function useACredit(
  user_id: number,
  type = 'classic',
  lesson_type_id: number = null,
  studio_id: number = null,
): Promise<Credit | OnlineCredit> {
  const user = await User.findByPk(user_id);
  let credits: Credit[] | OnlineCredit[];
  let studioCredits: Credit[] = [];
  let order: Order = [['expires_at', 'ASC']];

  let whereOptions: WhereOptions =
    lesson_type_id !== null
      ? {
          lesson_type_id,
          studio_id: null,
        }
      : {
          studio_id: null,
          lesson_type_id: null,
        };

  let query: FindAndCountOptions = {
    order,
    where: whereOptions,
  };
  let studioCreditsQuery: FindAndCountOptions = {
    order,
    where: {
      studio_id,
    },
  };

  studioCredits = (await user.$get(
    'available_credits',
    studioCreditsQuery,
  )) as Credit[];

  if (type === 'classic') {
    credits = (await user.$get('available_credits', query)) as Credit[];
  } else {
    credits = (await user.$get(
      'available_online_credits',
      query,
    )) as OnlineCredit[];
  }

  if (credits.length <= 0 && studioCredits.length <= 0) {
    throw new Error(
      'No cuentas con clases disponibles para este estudio o tipo de clase.',
    );
  }

  let credit =
    studioCredits.length > 0 ? studioCredits.shift() : credits.shift();

  if (credit) {
    credit.used = true;
    credit = await credit.save();
  }

  return credit;
}

export async function pausedValidity(
  availableCredits: Credit[],
  availableOnlineCredits: OnlineCredit[],
) {
  let credits: Credit[] = availableCredits;
  let onlineCredits: OnlineCredit[] = availableOnlineCredits;
  const currentdate = moment()
    .utcOffset('-05:00')
    .toDate();

  credits.length > 0 &&
    credits.map(async (credit: Credit) => {
      let expire = moment(credit.expires_at);
      let currentdatee = moment(currentdate);
      let dateRestart = currentdatee.add(1, 'years').toDate();
      credit.paused = true;
      credit.validity = expire.diff(currentdate, 'days') + 1;
      credit.expires_at = dateRestart;
      await credit.save();
    });

  onlineCredits.length > 0 &&
    onlineCredits.map(async (credit: OnlineCredit) => {
      let expire = moment(credit.expires_at);
      let currentdatee = moment(currentdate);
      let dateRestart = currentdatee.add(1, 'days').toDate();
      credit.paused = true;
      credit.validity = expire.diff(currentdate, 'days') + 1;
      credit.expires_at = dateRestart;
      await credit.save();
    });

  return true;
}

export async function reactivatedValidity(userId: number) {
  const credits = await Credit.findAll({
    where: {
      user_id: userId,
      paused: true,
    },
  });

  const onlineCredits = await Credit.findAll({
    where: {
      user_id: userId,
      paused: true,
    },
  });

  if (credits.length > 0 || onlineCredits.length > 0) {
    let date = moment()
      .utcOffset('-05:00')
      .toDate();
    credits.map(async (credit: Credit) => {
      let today = moment(date);
      let newExpire = today.add(credit.validity, 'days').toDate();
      credit.paused = false;
      credit.expires_at = newExpire;
      credit.validity = null;
      await credit.save();
    });

    onlineCredits.map(async (credit: Credit) => {
      let today = moment(date);
      let newExpire = today.add(credit.validity, 'days').toDate();
      credit.paused = false;
      credit.expires_at = newExpire;
      credit.validity = null;
      await credit.save();
    });

    return true;
  } else return false;
}

export async function validateYup(body: any, schema: yup.ObjectSchema) {
  const isValid = await schema.isValid(body);

  if (!isValid) {
    await schema.validate(body);
  }
}

export function findAvailablePlaces(places: Place[], reserved_places: Place[]) {
  return places.filter((place: Place) => {
    return isNullOrUndefined(
      reserved_places.find(reserved_place => {
        return place.id === reserved_place.id;
      }),
    );
  });
}

export async function addCourtesy(
  user: User,
  credits: number,
  plan_name: string,
  payment_method: any,
  expires_at?: Date,
) {
  const charge = new Charge();
  charge.status = 'paid';

  charge.order_id = '';
  charge.currency = 'MXN';
  charge.customer_name = user.name;
  charge.auth_code = '';
  charge.processed_at = new Date();
  charge.paid = 0;
  charge.total_credits = credits;

  charge.payment_method = payment_method;
  charge.card_type = 'cash';
  charge.card_brand = 'cash';
  charge.issuer = '';
  charge.fee = 0;
  charge.card_last4 = '';

  charge.user_id = user.id;
  charge.plan_name = plan_name;
  if (!isNullOrUndefined(expires_at)) {
    charge.expires_at = expires_at;
  }
  return await charge.save(payment_method);
}

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
