import React, { Component } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import InstructorService from "../../api/Instructor";
import './Modal.scss';

type Props = {
  show: boolean;
  parentCloseModal: () => void;
  parentShowAlert: (
    error: boolean,
    message: string,
    alertVariant: string
  ) => void;
};

type State = {
  loading: boolean;
  error: false;
  message: string;
  alertVariant: string;
  name: string;
  description: string;
  email: string;
};

class ModalInstructor extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      message: "",
      alertVariant: "",
      name: "",
      description: "",
      email: ""
    };

    this.handleClose = this.handleClose.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClose() {
    this.resetState();
    this.props.parentCloseModal();
  }

  async handleSubmit() {
    try {
      if (this.state.name === "") {
        this.props.parentShowAlert(
          true,
          "Debe introducir un nombre",
          "warning"
        );
        return;
      }
      if (this.state.description === "") {
        this.props.parentShowAlert(
          true,
          "Debe introducir una descripción",
          "warning"
        );
        return;
      }
      if (this.state.email === "") {
        this.props.parentShowAlert(
          true,
          "Debe introducir un correo",
          "warning"
        );
        return;
      }
      const response = await InstructorService.create(
        this.state.name,
        this.state.description,
        this.state.email
      );
      if (response) {
        this.props.parentShowAlert(
          true,
          "Instructor creado correctamente",
          "success"
        );
        this.handleClose();
      }
    } catch (error) {
      this.props.parentShowAlert(true, "Error creando instructor", "error");
    }
  }

  async resetState() {
    this.setState({
      message: "",
      alertVariant: "",
      name: "",
      description: ""
    });
  }

  async onChange(e: any) {
    const { currentTarget } = e;
    const { name, value } = currentTarget;
    const obj: any = { [name]: value };
    this.setState(obj);
  }

  buttonLoading() {
    if (this.state.loading) {
      return (
        <React.Fragment>
          <Row>
            <Col xs={6}>
              <Button variant="secondary" onClick={this.handleClose}>
                Cerrar
              </Button>
            </Col>
            <Col xs={6}>
              <Button variant='primary' onClick={this.handleSubmit}>
                Creando...
              </Button>
            </Col>

          </Row>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Row>
            <Col xs={6}>
              <Button variant="secondary" onClick={this.handleClose}>
                Cerrar
              </Button>

            </Col>
            <Col xs={6}>
              <Button variant='primary' onClick={this.handleSubmit}>
                Crear
              </Button>

            </Col>
          </Row>
        </React.Fragment>
      );
    }
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo instructor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="name"
                onChange={this.onChange}
                type="text"
                placeholder="Ingrese el nombre"
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                name="email"
                onChange={this.onChange}
                type="text"
                placeholder="Ingrese el correo"
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                name="description"
                onChange={this.onChange}
                type="text"
                placeholder="Ingrese la descripción"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>{this.buttonLoading()}</Modal.Footer>
      </Modal>
    );
  }
}

export default ModalInstructor;
