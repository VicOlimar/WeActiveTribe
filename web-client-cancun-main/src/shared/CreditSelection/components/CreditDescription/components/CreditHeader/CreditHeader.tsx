import React, { Fragment } from 'react';
import './CreditHeader.scss';
import { Plan } from '../../../../../../api/Plan/Plan';
import { isNullOrUndefined } from 'util';

type Props = { plan: Plan };
const CreditHeader = ({ plan }: Props) => {
  const splittedName = plan.name.split(' ');
  const headerClass = `credit-header${plan.special ? '-special' : ''}`;

  return (
    <div className={headerClass}>
      {
        splittedName[0].toLowerCase() === 'first' || plan.special ? <Fragment>
          <h4 className={`${headerClass} ${headerClass}__special_text`}>{plan.name}</h4>
        </Fragment> : <Fragment>
            <h4>{splittedName[0]}</h4>
            {!isNullOrUndefined(splittedName[1]) && <h5>{splittedName.slice(1).join(" ")}</h5>}
          </Fragment>
      }
    </div>
  )
}

export default CreditHeader;