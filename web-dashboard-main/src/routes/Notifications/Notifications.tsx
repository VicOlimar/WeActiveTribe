import React, { Component } from "react";
import { mdiAccountRemove } from "@mdi/js";
import { Col, Row, Button, Table } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import "./Notifications.scss";
import Input from "../../shared/Input";
import { User } from "../../api/Users/Users";
import UserService from "../../api/Users";
import ToggleButton from "react-toggle-button";
import Select from "react-select";
import Icon from "@mdi/react";
import NotificationService from "../../api/Notifications";
import Alert from "../../shared/alert";

type Props = {};

type State = {
  users: User[];
  toggleActive: boolean;
  selectedUsers: User[];
  search: string;
  error?: string;
  success: boolean;
};

class Notifications extends Component<State, Props> {
  state = {
    users: [],
    selectedUsers: [],
    toggleActive: true,
    search: "",
    error: undefined,
    success: false,
  };

  getUsers = async () => {
    try {
      const response: any | undefined = await UserService.find(
        1,
        10,
        this.state.search
      );
      if (response) {
        this.setState({ users: response.data }, () => this.mapUsersToSelect);
      }
    } catch (error) {}
  };

  onSubmit = async (values: any, { resetForm }: any) => {
    const { selectedUsers } = this.state;
    values.users = selectedUsers.map((user: User) => user.id);
    try {
      await NotificationService.send(values);
      this.setState({ success: true, search: "", selectedUsers: [] });
      resetForm();
    } catch (error) {
      this.setState({ error: (error as Error).message });
    }
  };

  onToggle = () => {
    this.setState({ toggleActive: !this.state.toggleActive });
  };

  handleInputChange = (input: string) => {
    this.setState({ search: input }, () => this.getUsers());
  };

  mapUsersToSelect = () => {
    if (this.state.users) {
      return this.state.users.map((user: User) => {
        return { label: user.email, value: user.id };
      });
    } else return [{ label: "", value: "" }];
  };

  onUserSelected = (option: any) => {
    const { users, selectedUsers } = this.state;
    const user = users.find((user: User) => user.id === option.value);
    if (user) {
      selectedUsers.push(user);
    }
    this.setState({ selectedUsers });
  };

  removeUser = (id: number) => {
    let { selectedUsers } = this.state;
    selectedUsers = selectedUsers.filter((user: User) => user.id !== id);
    this.setState({ selectedUsers });
  };

  render() {
    const { toggleActive, selectedUsers, error, success } = this.state;
    const notificationSchema = Yup.object().shape({
      title: Yup.string().required("El título es obligatorio"),
      subtitle: Yup.string(),
      content: Yup.string().required("Debes escribir un mensaje"),
    });

    const initialValues = {
      title: "",
      subtitle: "",
      content: "",
    };

    return (
      <Formik
        enableReinitialize
        validationSchema={notificationSchema}
        onSubmit={this.onSubmit}
        initialValues={initialValues}
      >
        {(props) => (
          <Form className="notifications">
            <div className="notifications__header">
              <h1 className="notifications__header__title header-title">
                NOTIFICACIONES
              </h1>
            </div>
            <p className="notifications__description">
              Para enviar una notificacion a uno o más usuarios utiliza el
              siguiente formulario:
            </p>

            <Row>
              <Col md={12} lg={{ span: 6, offset: 3 }}>
                <div className="notifications__form_container">
                  <Row>
                    <Col xs={12}>
                      <h3 className="notifications__subtitle">
                        Enviar notificación
                      </h3>
                    </Col>
                    <Col xs={12}>
                      <Input
                        label={"Título"}
                        name={"title"}
                        placeholder="Ejemplo: ¡Tenemos una sorpresa!"
                        required={true}
                        value={props.values.title}
                        type={"text"}
                        onChange={(e: any) => {
                          props.setFieldValue("title", e.target.value);
                        }}
                      />
                    </Col>
                    <Col xs={12}>
                      <Input
                        label={"Subtítulo"}
                        name={"subtitle"}
                        placeholder="Este campo es opcional"
                        required={true}
                        value={props.values.subtitle}
                        type={"text"}
                        onChange={(e: any) => {
                          props.setFieldValue("subtitle", e.target.value);
                        }}
                      />
                    </Col>
                    <Col xs={12}>
                      <Input
                        label={"Mensaje"}
                        name={"content"}
                        placeholder="¿Qué deseas decirle a tus usuarios?"
                        required={true}
                        value={props.values.content}
                        type={"textarea"}
                        onChange={(e: any) => {
                          props.setFieldValue("content", e.target.value);
                        }}
                      />
                    </Col>
                    <Col xs={12}>
                      <p className="notifications__toggle_message">
                        ¿Desea enviarle el mensaje a todos los usuarios?
                      </p>
                      <ToggleButton
                        inactiveLabel="No"
                        activeLabel="Sí"
                        value={toggleActive || false}
                        onToggle={this.onToggle}
                      />
                    </Col>
                    {!toggleActive && (
                      <Col className="notifications__users_list">
                        <p className="notifications__users_message">
                          Por favor busque y seleccione al menos un usuario
                        </p>
                        <Select
                          placeholder="Escribe un correo electrónico"
                          onInputChange={this.handleInputChange}
                          onChange={this.onUserSelected}
                          options={this.mapUsersToSelect()}
                        />
                        <Table
                          striped
                          bordered
                          hover
                          className="notifications__users_table"
                        >
                          <thead>
                            <tr>
                              <th>Nombre</th>
                              <th>Correo</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedUsers.length === 0 && (
                              <tr>
                                <td colSpan={3} className="text-center">
                                  Por favor selecciona al menos un usuario
                                </td>
                              </tr>
                            )}
                            {selectedUsers.map((user: User) => (
                              <tr>
                                <td>
                                  {user.name} {user.last_name}
                                </td>
                                <td>{user.email}</td>
                                <td>
                                  <button
                                    className={"notifications__remove_button"}
                                    onClick={() =>
                                      this.removeUser(Number(user.id))
                                    }
                                  >
                                    <Icon
                                      path={mdiAccountRemove}
                                      title="Editar usuario"
                                      size={1}
                                      color={"#F44336"}
                                    />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>
                    )}
                    <Col xs={12} className="text-right">
                      <Button
                        className="notifications__send_button"
                        type="submit"
                        disabled={!toggleActive && selectedUsers.length === 0}
                      >
                        Enviar
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            {error && (
              <Alert
                message={error}
                variant={"danger"}
                parentHandleClose={() => this.setState({ error: undefined })}
              ></Alert>
            )}
            {success && (
              <Alert
                message={"Notificación enviada correctamente"}
                variant={"success"}
                parentHandleClose={() => this.setState({ success: false })}
              ></Alert>
            )}
          </Form>
        )}
      </Formik>
    );
  }
}

export default Notifications;
