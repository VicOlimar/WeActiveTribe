import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { UserWithReserve, User } from "../../../../api/Users/Users";
import "./ReservationsTable.scss";
import { Studio } from "../../../../api/Studio/Studio";
import { Place } from "../../../../api/Place/Place";
import moment from "moment-timezone";
import weRideImage from "./images/we-ride.png";
import weHiitImage from "./images/we-hiit.png";

interface UserWPlace extends User {
  location: string;
}

type Props = {
  studio: Studio;
  date: Date;
  instructorsNames: string;
  list: UserWithReserve[];
  canceledList: UserWithReserve[];
  showCanceledReservations: boolean;
  objectLockedPlace?: any;
};

type State = {
  showCanceled: boolean;
};

class Reservations extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showCanceled: false,
    };
  }

  componentDidMount() {
    if (this.props.canceledList)
      if (this.props.canceledList.length > 0) {
        this.setState({ showCanceled: true });
      }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.canceledList)
      if (this.props.canceledList !== prevProps.canceledList) {
        if (this.props.canceledList.length > 0) {
          this.setState({ showCanceled: true });
        } else {
          this.setState({ showCanceled: false });
        }
      }
  }

  renderCanceledReservations = () => {
    if (this.props.canceledList) {
      let users: (UserWPlace | undefined)[] = this.props.canceledList.map(
        (reserve) => {
          let place: Place | undefined = this.props.studio.places.find(
            (place: Place) => {
              return place.id.toString() === reserve.place_id.toString();
            }
          );
          let userWPLace: UserWPlace;
          if (place) {
            userWPLace = {
              ...reserve.user,
              canceled_at: reserve.canceled_at,
              location: place.location,
            };
            return userWPLace;
          } else return undefined;
        }
      );
      if (users) {
        users.sort((a, b) =>
          a!.location.localeCompare(b!.location, undefined, { numeric: true })
        );
        return users.map((user) => {
          if (user) {
            const { location, name, last_name, email, canceled_at } = user;
            const cancelationLabel = canceled_at
              ? moment(canceled_at)
                  .utcOffset("-06:00")
                  .format("DD [de] MMMM [de] YYYY hh:mm a")
              : "-";
            return (
              <tr key={`${email} - ${location}`}>
                <td style={{ width: "10%" }}>{location}</td>
                <td style={{ width: "30%" }}>
                  {name} {last_name}
                </td>
                <td style={{ width: "30%" }}>{email}</td>
                <td style={{ width: "30%" }}>
                  {cancelationLabel} <br />{" "}
                  {`${
                    canceled_at
                      ? this.getTimeDifference(
                          moment(canceled_at),
                          moment(this.props.date)
                        )
                      : ""
                  }`}
                </td>
              </tr>
            );
          } else return null;
        });
      }
    } else return null;
  };

  getTimeDifference = (from: any, to: any) => {
    const diff = moment.duration(to.diff(from));

    return diff.asMinutes() > 59
      ? `${Math.floor(diff.asHours())} horas antes de la clase`
      : `${Math.floor(diff.asMinutes())} minutos antes de la clase`;
  };

  isLocked = (location: string) => {
    if (this.props.objectLockedPlace)
      return !this.props.objectLockedPlace.hasOwnProperty(location);
  };

  renderReservations = () => {
    let array = [];
    if (this.props.list) {
      let users: (UserWPlace | undefined)[] = this.props.list.map((reserve) => {
        let place: Place | undefined = this.props.studio.places.find(
          (place: Place) => {
            return (place.id as number) === reserve.place_id;
          }
        );
        let userWPLace: UserWPlace;
        if (place) {
          userWPLace = {
            ...reserve.user,
            location: place.location,
          };
          return userWPLace;
        } else return undefined;
      });
      if (users) {
        users.sort((a, b) =>
          a!.location.localeCompare(b!.location, undefined, { numeric: true })
        );
        if (this.props.studio.slug === "we-ride") {
          for (let placeNumber = 1; placeNumber < 34; placeNumber++) {
            const user = users.find((user) => +user!.location === placeNumber);
            if (user) {
              array.push(
                <tr key={placeNumber}>
                  <td style={{ width: "25%", height: "39px" }}>
                    {user.location}
                  </td>
                  <td style={{ width: "25%", height: "39px" }}>
                    {user.name} {user.last_name}
                  </td>
                  <td style={{ width: "25%", height: "39px" }}>{user.email}</td>
                  <td style={{ width: "25%", height: "39px" }}></td>
                </tr>
              );
            } else {
              array.push(
                <tr key={placeNumber}>
                  <td style={{ width: "25%", height: "39px" }}>
                    {placeNumber}
                  </td>
                  <td style={{ width: "25%", height: "39px" }}></td>
                  <td style={{ width: "25%", height: "39px" }}></td>
                  <td style={{ width: "25%", height: "39px" }}></td>
                </tr>
              );
            }
          }
        } else if (this.props.studio.slug === "we-hiit") {
          for (let placeNumber = 1; placeNumber <= 18; placeNumber++) {
            const user = users.find((user) => +user!.location === placeNumber);
            array.push(
              <tr key={placeNumber}>
                <td style={{ width: "25%", height: "44px" }}>{placeNumber}</td>
                <td style={{ width: "25%", height: "44px" }}>
                  {user?.name} {user?.last_name}
                </td>
                <td style={{ width: "25%", height: "44px" }}>{user?.email}</td>
                <td style={{ width: "25%", height: "44px" }}></td>
              </tr>
            );
          }
        } else if (this.props.studio.slug === "online") {
          for (let placeNumber = 1; placeNumber <= 100; placeNumber++) {
            let user = users.find((user) => {
              return +user!.location === placeNumber;
            });
            if (user) {
              array.push(
                <tr key={placeNumber}>
                  <td style={{ width: "25%", height: "39px" }}>
                    {user.location}
                  </td>
                  <td style={{ width: "25%", height: "39px" }}>
                    {user.name} {user.last_name}
                  </td>
                  <td style={{ width: "25%", height: "39px" }}>{user.email}</td>
                  <td style={{ width: "25%", height: "39px" }}></td>
                </tr>
              );
            } else {
              array.push(
                <tr key={placeNumber}>
                  <td style={{ width: "25%", height: "39px" }}>
                    {placeNumber}
                  </td>
                  <td style={{ width: "25%", height: "39px" }}></td>
                  <td style={{ width: "25%", height: "39px" }}></td>
                  <td style={{ width: "25%", height: "39px" }}></td>
                </tr>
              );
            }
          }
        }
        return array;
      } else return null;
    }
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <div className={`reservations`}>
            <div className="reservations__header">
              <div className="reservations__header-left">
                <p>
                  <b> Reservaciones vigentes</b>
                </p>
                <p>
                  <b>Horario:</b>{" "}
                  {moment(this.props.date)
                    .utcOffset("-06:00")
                    .format("hh:mm a")}
                </p>
                <p>
                  <b>Fecha:</b>{" "}
                  {moment(this.props.date)
                    .utcOffset("-06:00")
                    .format("DD [de] MMMM [de] YYYY")}
                </p>
                <p>
                  <b>Instructor:</b>{" "}
                  {this.props.instructorsNames
                    ? this.props.instructorsNames
                    : ""}
                </p>
              </div>
              <div className="reservations__header-right">
                {this.props.studio.slug === "we-ride" && (
                  <img
                    src={weRideImage}
                    alt="we-hiit"
                    style={{ maxWidth: "330px" }}
                  />
                )}
                {this.props.studio.slug === "we-hiit" && (
                  <img
                    src={weHiitImage}
                    alt="we-ride"
                    style={{ maxWidth: "330px" }}
                  />
                )}
                {this.props.studio.slug === "online" && (
                  <img src={weHiitImage} alt="we-online" />
                )}
              </div>
            </div>
            <Table className="reservations__table" bordered hover>
              <thead>
                <tr>
                  <th>Lugar</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Asistencia</th>
                </tr>
              </thead>
              <tbody>{this.renderReservations()}</tbody>
            </Table>
          </div>
          {this.state.showCanceled && (
            <div
              className={`reservations ${
                this.props.showCanceledReservations ? "" : "hidden"
              }`}
            >
              {" "}
              <div className="reservations__header">
                <div className="reservations__header-left">
                  <p>
                    <b> Reservaciones canceladas</b>
                  </p>
                  <p>
                    <b>Horario:</b>{" "}
                    {moment(this.props.date)
                      .utcOffset("-06:00")
                      .format("hh:mm a")}
                  </p>
                  <p>
                    <b>Fecha:</b>{" "}
                    {moment(this.props.date)
                      .utcOffset("-06:00")
                      .format("DD [de] MMMM [de] YYYY")}
                  </p>
                  <p>
                    <b>Instructor:</b>{" "}
                    {this.props.instructorsNames
                      ? this.props.instructorsNames
                      : ""}
                  </p>
                </div>
                <div className="reservations__header-right">
                  {this.props.studio.slug === "we-ride" && (
                    <img
                      src={weRideImage}
                      alt="we-ride"
                      style={{ maxWidth: "330px" }}
                    />
                  )}
                  {this.props.studio.slug === "we-hiit" && (
                    <img
                      src={weHiitImage}
                      alt="we-hiit"
                      style={{ maxWidth: "330px" }}
                    />
                  )}
                </div>
              </div>
              <Table className="reservations__table" bordered hover>
                <thead>
                  <tr>
                    <th>Lugar</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Fecha de cancelación</th>
                  </tr>
                </thead>
                <tbody>{this.renderCanceledReservations()}</tbody>
              </Table>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Reservations;
