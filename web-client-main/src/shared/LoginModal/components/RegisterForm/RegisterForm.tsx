import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import Button from './../Button';
import Input from './../../../Input';
import * as Yup from 'yup'
import './RegisterForm.scss';

type Props = {
  onSubmit: Function,
  loading: boolean,
}

type State = {}

type FormValues = {
  name: string,
  last_name: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string,
  acceptPolicies: boolean,
}

class RegisterForm extends Component<Props, State> {
  phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;


  /**
    * 
    * @param {*} values 
    */
  onSubmit = (values: FormValues) => {
    this.props.onSubmit(values);
  }

  render() {
    const { loading } = this.props;

    const signUpValidationSchema = Yup.object().shape({
      name: Yup.string().required('Campo requerido'),
      last_name: Yup.string().required('Campo requerido'),
      email: Yup.string().email('Escribe un correo válido').required('Campo requerido'),
      phone: Yup.string().matches(this.phoneRegExp, 'El número telefónico no es válido'),
      password: Yup.string().min(8, 'Debe ser 8 caracteres mínimo'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], 'Las contraseñas deben coincidir'),
      acceptPolicies: Yup.boolean().oneOf([true], 'Debes aceptar los términos y condiciones'),
    })

    const initialValues = {
      name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: 'confirmPassword',
      acceptPolicies: false,
    };

    return (
      <Formik
        enableReinitialize
        validationSchema={signUpValidationSchema}
        onSubmit={this.onSubmit}
        initialValues={initialValues}
      >
        {props => (
          <Form className={'register__form'}>
            <Row>
              <Col xs={12}>
                <Input
                  label={''}
                  name={'name'}
                  placeholder='Nombre'
                  required={true}
                  value={props.values.name}
                  type={'text'}
                  onChange={(e: any) => { props.setFieldValue('name', e.target.value) }}
                />
              </Col>
              <Col xs={12}>
                <Input
                  label={''}
                  name={'last_name'}
                  placeholder='Apellido'
                  required={true}
                  value={props.values.last_name}
                  type={'text'}
                  onChange={(e: any) => { props.setFieldValue('last_name', e.target.value) }}
                />
              </Col>
              <Col xs={12}>
                <Input
                  label={''}
                  name={'email'}
                  placeholder='Correo'
                  required={true}
                  value={props.values.email}
                  type={'text'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { props.setFieldValue('email', e.target.value) }}
                />
              </Col>
              <Col xs={12}>
                <Input
                  label={''}
                  name={'phone'}
                  placeholder='Teléfono'
                  required={true}
                  value={props.values.phone}
                  type={'text'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { props.setFieldValue('phone', e.target.value) }}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { props.setFieldValue('password', e.target.value) }}
                />
              </Col>
              <Col xs={12}>
                <Input
                  label={''}
                  type="password"
                  name={'confirmPassword'}
                  placeholder='Confirmar contraseña'
                  required={true}
                  value={props.values.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { props.setFieldValue('confirmPassword', e.target.value) }}
                />
              </Col>
              <Col xs={12}>
                <div className={'register__form__checkbox'}>
                  <Input
                    link={'/terms'}
                    label={'Acepto términos y condiciones'}
                    name={'acceptPolicies'}
                    type='checkbox'
                    required={true}
                    checked={props.values.acceptPolicies}
                    onChange={(e: any) => { props.setFieldValue('acceptPolicies', e.target.checked) }}
                  />
                </div>
              </Col>
              <Col xs={12}>
                <Button className='register__form__register' type='submit' loading={loading} text={'Registrarme'} />
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    )
  }
}

export default RegisterForm;