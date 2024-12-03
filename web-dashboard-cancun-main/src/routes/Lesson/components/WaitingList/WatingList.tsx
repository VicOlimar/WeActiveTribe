import React from 'react';
import { Table } from 'react-bootstrap';
import { User } from '../../../../api/Users/Users';
import { Studio } from '../../../../api/Studio/Studio';
import moment from 'moment';
import weRideImage from '../Reservations/images/we-ride.png';
import weHiitImage from '../Reservations/images/we-hiit.png';
import { WaitingRow } from './WaitingRow';

type WaitingWithUser = {
  id: number;
  canceled: boolean;
  date: string;
  reserved_at: string | null;
  reserve_id: string | null;
  lesson_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: User;
};

type Props = {
  studio: Studio;
  date: Date;
  instructorsNames: string;
  list: WaitingWithUser[];
};

export const WaitingList = ({
  list = [],
  date = new Date(),
  instructorsNames = '',
  studio,
}: Props) => {
  return (
    <>
      <div>
        <div className={`reservations`}>
          <div className="reservations__header">
            <div className="reservations__header-left">
              <p>
                <b>Lista de Espera</b>
              </p>
              <p>
                <b>Horario:</b>{' '}
                {moment(date).utc().utcOffset('-05:00').format('hh:mm a')}
              </p>
              <p>
                <b>Fecha:</b>{' '}
                {moment(date)
                  .utc()
                  .utcOffset('-05:00')
                  .format('DD [de] MMMM [de] YYYY')}
              </p>
              <p>
                <b>Instructor:</b> {instructorsNames}
              </p>
            </div>
            <div className="reservations__header-right">
              {studio?.slug === 'we-ride' && (
                <img src={weRideImage} alt="we-hiit" />
              )}
              {studio?.slug === 'we-hiit' && (
                <img src={weHiitImage} alt="we-ride" style={{ maxWidth: "330px" }}/>
              )}
              {studio?.slug === 'online' && (
                <img src={weHiitImage} alt="we-online" style={{ maxWidth: "330px" }}/>
              )}
            </div>
          </div>
          <Table className="reservations__table" bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              {list.length > 0 &&
                list.map((wait) => <WaitingRow waiting={wait} />)}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};
