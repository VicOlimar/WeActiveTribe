import React, { Component, Fragment } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Logo from './assets/logo.png';
import './RecoveryPassword.scss';
import Footer from '../../shared/Footer';
import AppMeta from '../../shared/AppMeta';
import ProfileButton from '../Profile/components/ProfileButton';
import Loader from '../../shared/Loader';
import AuthService from '../../api/Auth/Auth';
import { withRouter, RouteComponentProps } from 'react-router';
import queryString from 'query-string';
import SimpleAlert from '../../shared/SimpleAlert';

type Props = RouteComponentProps<any> & {}
type State = {
  email: string,
  loading: Boolean,
  showMessage: Boolean,
  message: string,
  token?: any,
  password: string,
  passwordConfirm: string,
  errorMessage: string,
  showErrorMessage: boolean,
}

class RecoveryPassword extends Component<Props, State> {

  state = {
    email: '',
    loading: false,
    showMessage: false,
    message: '',
    token: undefined,
    password: '',
    passwordConfirm: '',
    errorMessage: '',
    showErrorMessage: false,
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.handleTokenInURL();
  }

  handleTokenInURL = () => {
    const values = queryString.parse(this.props.location.search);
    if (values.token) {
      this.setState({ token: values.token });
    }
  }

  handleSubmit = async () => {
    this.setState({ loading: true });
    const response: any = await AuthService.resetPassword(this.state.email);
    if (typeof response === 'string') {
      this.setState({ loading: false, errorMessage: response, showErrorMessage: true });
    } else {
      this.setState({ loading: false, showMessage: true, message: '¡Se ha enviado exitosamente el correo de recuperación a tu cuenta!' });
    }
  }

  handlePasswordReset = async () => {

    if (this.state.password !== this.state.passwordConfirm) {
      this.setState({ errorMessage: 'Las contraseñas no coinciden.', showErrorMessage: true });
      return
    }

    if (this.state.password.length < 8) {
      this.setState({ errorMessage: 'La contraseña debe ser mínimo de 8 caracteres', showErrorMessage: true });

      return
    }

    this.setState({ loading: true });
    const response: any = await AuthService.changePassword(this.state.token, this.state.password);
    if (typeof response === 'string') {
      this.setState({ loading: false, errorMessage: response, showErrorMessage: true });
    } else {
      this.setState({ loading: false, showMessage: true, message: '¡Tu contraseña ha sido reestablecida exitosamente!' });
    }
  }

  render() {
    return (
      <Fragment>
        <AppMeta title='Recuperación de contraseña' />
        <div className='recovery_password'>
          <Container>
            <Row>
              <Col xs='12'>
                <div className='recovery_password__logo_container'>
                  <img className='recovery_password__logo_container__image' src={Logo} alt='We Cycling logo' />
                </div>
              </Col>
              <Col xs='12'>
                <h1 className='recovery_password__title'>Proceso de Recuperación de Contraseña</h1>
              </Col>
            </Row>
            <Row>
              <Col xs='12' md={{ offset: 3, span: 6 }}>
                <p className='recovery_password__text'>
                  {
                    !this.state.token ? 'Para iniciar el proceso de recuperación de contraseña, te enviaremos un link a tu correo electrónico usado en la aplicación, por favor ingresa tu correo electrónico:' : 'Por favor escribe tu nueva contraseña:'
                  }
                </p>
              </Col>
              {
                !this.state.showMessage && !this.state.loading && !this.state.token && <Col xs='12' md={{ offset: 3, span: 6 }}>
                  <input
                    className='recovery_password__input'
                    name='name'
                    type='email'
                    value={this.state.email}
                    placeholder='Tu correo electrónico'
                    onChange={event => this.setState({ email: event.target.value })}
                  />
                  <div className='recovery_password__button_container'>
                    {
                      this.state.loading ? <Loader show={this.state.loading} /> : <ProfileButton onClick={this.handleSubmit}>Recuperar</ProfileButton>
                    }
                  </div>
                </Col>
              }
              {
                this.state.token && !this.state.showMessage && !this.state.loading && <Col xs='12' md={{ offset: 3, span: 6 }}>
                  <input
                    className='recovery_password__input'
                    name='password'
                    type='password'
                    value={this.state.password}
                    placeholder='Tu contraseña'
                    onChange={event => this.setState({ password: event.target.value })}
                  />
                  <input
                    className='recovery_password__input'
                    name='recovery_password'
                    type='password'
                    value={this.state.passwordConfirm}
                    placeholder='Confirma tu contraseña'
                    onChange={event => this.setState({ passwordConfirm: event.target.value })}
                  />
                  <div className='recovery_password__button_container'>
                    {
                      this.state.loading ? <Loader show={this.state.loading} /> : <ProfileButton onClick={this.handlePasswordReset}>Recuperar</ProfileButton>
                    }
                  </div>
                </Col>
              }
              {
                this.state.showMessage && <Col xs='12' md={{ offset: 3, span: 6 }}>
                  <p className='recovery_password__text' style={{ textAlign: 'center', fontSize: '18px' }}>{this.state.message}</p>
                </Col>
              }
            </Row>
          </Container>
        </div>
        <Footer />
        <SimpleAlert title='' text={this.state.errorMessage} show={this.state.showErrorMessage} onConfirm={() => this.setState({ errorMessage: '', showErrorMessage: false })} />
      </Fragment>
    )
  }
}

export default withRouter(RecoveryPassword);