import { isUndefined } from 'util';
import { compareEqualDateWithoutTime } from '../../libraries/util';
import { Credit } from '../../models/Credit';
import { CreditDetail } from '../interfaces/UserController.interface';

export type CreditKeys = keyof { [k: string]: Credit };

export function groupTypeCredit(
  availableCredits: Credit[],
  groupBy: CreditKeys[],
): CreditDetail[] {
  if (!availableCredits || !groupBy.length) {
    return [];
  }
  return availableCredits.reduce(
    (creditsDetail: CreditDetail[], credit: Credit) => {
      const isNewValue = !creditsDetail.find(creditDetail =>
        isEqualKeysCredits(creditDetail, credit, groupBy),
      );
      if (isNewValue) {
        const amount = availableCredits.filter(creditProcess =>
          isEqualKeysCredits(creditProcess, credit, groupBy),
        ).length;

        creditsDetail.push({
          canceled: credit.canceled,
          expires_at: credit.expires_at,
          paused: credit.paused,
          validity: credit.validity,
          lesson_type_id: credit.lesson_type_id,
          lesson_type: credit.lesson_type?.name,
          studio_id: credit.studio_id,
          studio: credit.studio?.name,
          amount,
        });
      }
      return creditsDetail;
    },
    [],
  );
}

export function isEqualKeysCredits(
  creditProccess: CreditDetail | Credit,
  credit: Credit,
  keys: CreditKeys[],
): boolean {
  return keys.every(key => {
    if (isUndefined(creditProccess[key]) || isUndefined(credit[key])) {
      return false;
    }
    if (['expires_at', 'created_at', ''].includes(key as string)) {
      return compareEqualDateWithoutTime(creditProccess[key], credit[key]);
    }
    return creditProccess[key] === credit[key];
  });
}
