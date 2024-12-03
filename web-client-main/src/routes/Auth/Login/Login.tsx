import React from 'react';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import './Login.scss';
import CheckboxLabel from '../../../shared/CheckboxLabel/CheckboxLabel';

const { Group, Label, Control, Check } = Form;

class Login extends React.Component {

  render() {
    return (
      <div className="container">
        <div className="auth-form">
          <div className="auth-form-container">
            <Form>
              <Group controlId="email">
                <Label className="sr-only">Email</Label>
                <Control type="email" placeholder="Email" />
              </Group>
              <Group controlId="password">
                <Label className="sr-only">Password</Label>
                <Control type="password" placeholder="Contraseña" />
              </Group>
              <Group controlId="confirmPassword">
                <Label className="sr-only">Confirma tu contraseña</Label>
                <Control type="password" placeholder="Confirma tu contraseña" />
              </Group>
              <Group controlId="terms">
                <Check 
                  type="checkbox"
                  label={
                  <CheckboxLabel text='Acepto los ' link='/terms' linkText='términos y condiciones' />
                  }
                />
              </Group>
              <Button block variant="primary" type="submit"> Registrarme </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
