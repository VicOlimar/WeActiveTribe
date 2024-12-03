import React, { Component } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import Select from 'react-select';
import './ReserveModal.scss';

import { Place } from '../../../../api/Place/Place';
import { User } from '../../../../api/Users/Users';
import UserService from '../../../../api/Users';

type Props = {
  place?: Place;
  onClose?: Function;
  onConfirm?: Function;
  onConfirmBlock?: Function;
  onConfirmVisible?: Function;
  show: boolean;
  message?: string;
  loading: boolean;
}

type State = {
  user?: any,
  users: User[],
  search: string,
}

class ReserveModal extends Component<Props, State> {

  state = {
    user: undefined,
    users: [],
    search: '',
  }

  getUsers = async () => {
    try {
      const response: any | undefined = await UserService.find(1, 10, this.state.search);
      if (response) {
        this.setState({ users: response.data }, () => this.mapUsersToSelect);
      }
    } catch (error) {

    }
  }

  mapUsersToSelect = () => {
    if (this.state.users) {
      return this.state.users.map((user: User) => { return { label: user.email, value: user.id } });
    } else return [{ label: '', value: '' }];
  }

  handleInputChange = (input: string) => {
    this.setState({ search: input }, () => this.getUsers());
  }

  render() {
    const { place, message, loading } = this.props;
    return (
      <Modal backdrop={loading ? 'static' : true} show={this.props.show} onHide={() => { if (this.props.onClose) this.props.onClose() }}>
        <Modal.Header closeButton>
          <Modal.Title>Reservar el lugar {place ? place.location : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            message && <Alert variant="warning" onClose={() => { if (this.props.onClose) this.props.onClose() }} dismissible>
              {message}
            </Alert>
          }
          <Form.Group className="text-center" controlId="exampleForm.ControlSelect1">
            <Form.Label>Selecciona al usuario</Form.Label>
            <Select
              placeholder='Escribe un correo electrónico'
              value={this.state.user}
              onInputChange={this.handleInputChange}
              onChange={(option: any) => this.setState({ user: option })}
              options={this.mapUsersToSelect()}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            if (this.props.onClose) {
              this.setState({ user: undefined });
              this.props.onClose();
            }
          }}>
            Cerrar
          </Button>
          <Button
            variant='warning' onClick={() => {
              this.props.onConfirmBlock && this.props.onConfirmBlock();
            }}
          >Bloquear</Button>
          <Button
            variant='dark' onClick={() => {
              this.props.onConfirmVisible && this.props.onConfirmVisible()
            }}>
            Ocultar lugar
          </Button>
          <Button disabled={loading} variant="primary" onClick={() => {
            if (this.props.onConfirm) {
              this.setState({ user: undefined });
              this.props.onConfirm(this.state.user);
            }
          }}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ReserveModal;