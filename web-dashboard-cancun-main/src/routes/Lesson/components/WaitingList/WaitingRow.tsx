import React from 'react';
import moment from 'moment';
import { WaitingWithUser } from './types';

type Props = {
  waiting: WaitingWithUser;
};

export const WaitingRow = ({ waiting }: Props) => {
  const { user } = waiting;
  const phone = user.profile?.phone;
  return (
    <tr key={user.email}>
      <td style={{ width: '30%' }}>
        {user.name} {user.last_name}
      </td>
      <td style={{ width: '30%' }}>{user.email}</td>
      <td style={{ width: '30%' }}>{phone}</td>
      <td style={{ width: '30%' }}>
        {moment(waiting.created_at)
          .utc()
          .utcOffset('-05:00')
          .format('DD [de] MMMM [de] YYYY hh:mm a')}
      </td>
    </tr>
  );
};
