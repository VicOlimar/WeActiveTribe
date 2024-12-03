import React, { Component } from "react";
import { Card, Form } from "react-bootstrap";
import Overlay from "../../shared/ovelay/index";
import Loader from "../../shared/Loader/index";
import Alert from "../../shared/alert/index";
import { RouteComponentProps } from 'react-router-dom';
import AuthService from '../../api/Auth/Auth';
import  { withUserContext } from '../../contexts/UserContext';
import {DefaultUserContext} from '../../contexts/UserContext/UserContext';

import "./Login.scss";

type Props = RouteComponentProps<any> & {
  userContext?: DefaultUserContext;
};

type State = {
  error: boolean;
  loading: boolean;
  message: string;
  data: string;
  email: string;
  password: string;
  alertVariant: string;
};

class Login extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: false,
      loading: false,
      message: "Error",
      data: "",
      email: "",
      password: "",
      alertVariant: ""
    };
  }

  componentWillMount = async () => {
    if (this.props.userContext) await this.props.userContext.resetState();
  }

  closeAlert = () => {
    this.setState({ error: false });
  };

  async login(e: any, email: string, password: string) {
    e.preventDefault();
    try {
      const response = await AuthService.login(email, password);
      if(!response) throw new Error('Credenciales inválidas');
      this.props.userContext!.setState(response);
      this.props.history.push('purchases');
      e.stopPropagation();
    } catch (error) {
      this.setState({ alertVariant: 'error', message: error.message, error: true});
    }
  }

  onChange = (e: any) => {
    const {currentTarget} = e;
    const {name, value} =currentTarget;
    const obj: any = {[name]: value};
    this.setState(obj);
  }

  render() {
    return (
      <div className="login">
        {this.state.loading && (
          <Overlay>
            <Loader></Loader>
          </Overlay>
        )}
        {this.state.error && (
            <Alert
              parentHandleClose={this.closeAlert}
              variant={
                this.state.alertVariant ? this.state.alertVariant : "success"
              }
              message={this.state.message}
            ></Alert>
        )}
        <div className="login__container">
          <Card bsPrefix="login__container__card" className="login__container__centered">
            <Card.Body bsPrefix='login__container__card__body'>
              <Form bsPrefix='login__container__card__body__form' onSubmit={(e: any) => this.login(e, this.state.email, this.state.password)}>
                <Form.Group controlId="emailForm">
                  <Form.Control
                    bsPrefix='login__container__card__body__form__input'
                    type="email"
                    name='email'
                    placeholder="Ingrese su email"
                    onChange={this.onChange}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="passwordForm">
                  <Form.Control
                    bsPrefix='login__container__card__body__form__input'
                    type="password"
                    name='password'
                    placeholder="Ingrese su contraseña"
                    onChange={this.onChange}
                  ></Form.Control>
                </Form.Group>
                <div className="login__container__card__body__form__flex-button-row">
                  <button className='login__container__card__body__form__flex-button-row__button' type="submit">Iniciar sesión</button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}
export default withUserContext(Login);
