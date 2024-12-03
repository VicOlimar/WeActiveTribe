import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup'
import Button from './../Button';
import Input from './../../../Input';
import './LoginForm.scss';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

type Props = RouteComponentProps<any> & {
  onSubmit: Function,
  onClose: Function,
  loading: boolean,
}

type State = {}

type FormValues = {
  email: string,
  password: string,
  remember_me: boolean,
}

/*
<Col xs={12}>
  <Link className='login__form__link' to='/'>No recuerdo mi contraseña</Link>
</Col>
*/

class LoginForm extends Component<Props, State> {
  /**
    * 
    * @param {*} values 
    */
  onSubmit = (values: FormValues) => {
    this.props.onSubmit(values);
  }

  goToRecoveryPassword = () => {
    if (this.props.history.location.pathname === '/recovery_password') {
      window.location.href = '/recovery_password';
    } else {
      this.props.history.push('/recovery_password');
      this.props.onClose();
    }
  }

  render() {
    const { loading } = this.props;
    const loginValidationSchema = Yup.object().shape({
      email: Yup.string().required('Campo requerido'),
      password: Yup.string().required('Campo requerido'),
      remember_me: Yup.bool(),
    });

    const initialValues = {
      email: '',
      password: '',
      remember_me: true,
    };

    return (
      <Formik
        enableReinitialize
        validationSchema={loginValidationSchema}
        onSubmit={this.onSubmit}
        initialValues={initialValues}
      >
        {props => (
          <Form className={'login__form'}>
            <Row>
              <Col xs={12}>
                <Input
                  label={''}
                  type="email"
                  name={'email'}
                  placeholder='Correo'
                  required={true}
                  value={props.values.email}
                  onChange={(e: any) => { props.setFieldValue('email', e.target.value) }}
                />
              </Col>
              <Col xs={12}>
                <Input
                  label={''}
                  type="password"
                  name={'password'}
                  placeholder='Contraseña'
                  required={true}
                  value={props.values.password}
                  onChange={(e: any) => { props.setFieldValue('password', e.target.value) }}
                />
              </Col>
              <Col xs={12}>
                <Button type='submit' className='login__form__register' text='Iniciar sesión' loading={loading} />
              </Col>
              <Col xs={12}>
                <div className={'login__form__checkbox'}>
                  <Input
                    label={'Recordar mis datos'}
                    name={'remember_me'}
                    type='checkbox'
                    required={false}
                    checked={props.values.remember_me}
                    onChange={(e: any) => { props.setFieldValue('remember_me', e.target.checked) }}
                  />
                </div>
              </Col>
              <Col xs={12}>
                <Link className='login__form__link' role='button' to='/recovery_password' onClick={this.goToRecoveryPassword}>No recuerdo mi contraseña</Link>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    );
  }
}

export default withRouter(LoginForm);