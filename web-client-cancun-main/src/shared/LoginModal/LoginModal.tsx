import React, { Component } from 'react';
import Modal from './../Modal';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AuthService from './../../api/Auth/Auth';
import ReactGA from 'react-ga';

import './LoginModal.scss';

const FORMS = {
  register: 'register',
  login: 'login',
};

type Props = {
  show: boolean;
  onClose: Function;
  onOk: Function;
  notifyError?: Function;
};

type State = {
  form: string;
  switching: boolean;
  height: string;
  loading: boolean;
};

class LoginModal extends Component<Props, State> {
  formik: any = React.createRef();
  animation_time = 500;
  register_modal_height = '800px';
  login_modal_height = '362px';
  state = {
    form: FORMS.login,
    switching: false,
    height: '332px',
    loading: false,
  };

  /**
   *
   * @param {*} values
   */
  onSubmit = async (values: any) => {
    const { notifyError } = this.props;
    const { form } = this.state;
    let response = null;
    this.setState({ loading: true });
    if (form === FORMS.login) {
      response = await AuthService.login(values.email, values.password);
    } else {
      const {
        email,
        password,
        name,
        last_name,
        phone,
        emergency_contact,
        emergency_contact_name,
      } = values;
      response = await AuthService.register({
        email,
        password,
        name,
        last_name,
        phone,
        emergency_contact,
        emergency_contact_name,
      });
      if (response !== null) {
        values.remember_me = true;
      }
    }

    if (typeof response === 'string') {
      if (notifyError) {
        notifyError(response);
      }
    } else {
      ReactGA.event({
        category: 'User',
        action: FORMS.login ? 'Inicio de sesión' : 'Nuevo registro',
      });
      this.props.onOk(response, values.remember_me);
    }

    this.setState({ loading: false });
  };

  switchForms = (callback: Function) => {
    const { form, switching } = this.state;
    this.setState({ switching: !switching, height: '0px' }, () => {
      setTimeout(() => {
        switch (form) {
          case FORMS.login:
            this.setState({ form: FORMS.register }, this.switch);
            break;
          case FORMS.register:
            this.setState({ form: FORMS.login }, this.switch);
            break;
          default:
            this.setState({ form: FORMS.login }, this.switch);
        }
      }, this.animation_time);
    });
  };

  switch = () => {
    const { form, switching } = this.state;
    setTimeout(() => {
      this.setState({
        switching: !switching,
        height:
          form === FORMS.register
            ? this.register_modal_height
            : this.login_modal_height,
      });
    }, this.animation_time);
  };

  render() {
    const { height, form, switching, loading } = this.state;
    return (
      <div className={'login__modal'}>
        <Modal
          show={this.props.show}
          footer={
            <Footer
              text={form === FORMS.register ? 'Iniciar sesión' : 'Registrarse'}
              onClick={this.switchForms}
            />
          }
          onClose={() => this.props.onClose(this.switch)}
        >
          <div
            className={`login__modal__form ${switching ? 'hide' : 'show'}`}
            style={{ height }}
          >
            {!switching &&
              (form === FORMS.register ? (
                <RegisterForm onSubmit={this.onSubmit} loading={loading} />
              ) : (
                <LoginForm
                  onClose={this.props.onClose}
                  onSubmit={this.onSubmit}
                  loading={loading}
                />
              ))}
          </div>
        </Modal>
      </div>
    );
  }
}

export default LoginModal;
