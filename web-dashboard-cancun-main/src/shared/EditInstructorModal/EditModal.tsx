import React, { Component } from "react";
import { Modal, Col, Row, Button, Form, Image } from "react-bootstrap";
import InstructorService from "../../api/Instructor";
import "./EditModal.scss";
import noAvatar from './images/noAvatar.svg';
import Overlay from '../../shared/ovelay/index';
import Loader from '../../shared/Loader/index';

type Props = {
  show: boolean;
  id: number | null;
  parentLeveClose: () => void;
  parentLevelAlert: (
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
  selectedFile: any;
  avatar: any | undefined;
  email: string;
  experience: string;
};

interface FormValues {
  name: string;
  description: string;
}

class EditModal extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      message: "",
      alertVariant: "",
      name: "",
      description: "",
      selectedFile: null,
      avatar: undefined,
      email: "",
      experience: ""
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClose() {
    this.resetState();
    this.props.parentLeveClose();
  }

  uploadAvatar = async () => {
    try {
      let avatarResponse: string | undefined;
      if (this.props.id) {
        avatarResponse = await InstructorService.uploadAvatar(this.props.id, this.state.selectedFile);
      }
      if (avatarResponse) {
        this.getInstructor();
      } else {
        this.props.parentLevelAlert(
          true,
          "No se pudo cargar el avatar",
          "warning"
        );
      }
    } catch (error) {
      this.props.parentLevelAlert(
        true,
        "Error cargando el avatar",
        "error"
      );
    }
  }

  handleSubmit = async () => {
    try {
      const response = await InstructorService.update(
        this.props.id!,
        this.state.name,
        this.state.description,
        this.state.email,
        this.state.experience
      );
      if (response !== undefined) {
        this.props.parentLevelAlert(
          true,
          "Instructor actualizado correctamente",
          "success"
        );
        this.handleClose();
      } else throw new Error();
    } catch (error) {
      this.props.parentLevelAlert(
        true,
        "Error actualizando instructor",
        "error"
      );
    }
  }

  async componentDidUpdate(prevProps: Props) {
    try {
      if (this.props.show !== prevProps.show) {
        this.getInstructor();
      }
    } catch (error) {
      this.props.parentLevelAlert(true, "Error cargando instructor", "error");
      this.handleClose();
    }
  }

  getInstructor = async () => {
    if (this.props.id) {
      const response = await InstructorService.findOne(this.props.id);
      if (response) {
        this.setState({
          name: response.name,
          description: response.description,
          avatar: response.avatar,
          email: response.email
        });
      }

    }
  }

  async resetState() {
    this.setState({
      message: "",
      alertVariant: "",
      name: "",
      description: "",
      selectedFile: null,
      avatar: null,
      email: ""
    });
  }

  onChange = (e: any) => {
    const { currentTarget } = e;
    const { name, value } = currentTarget;
    const obj: any = { [name]: value };
    this.setState(obj);
  };

  fileHandler = (e: any) => {
    this.setState({ selectedFile: e.target.files[0], loading: true }, () => {
      this.uploadAvatar();
      this.getInstructor();
      this.setState({ loading: false });
    });
  }

  onChangeSelect = (e: any) => {
    const { currentTarget } = e;
    const { name, value } = currentTarget;
    const obj: any = { [name]: value };
    this.setState(obj);
  };

  render() {
    return (
      <React.Fragment>
        {this.state.loading && (
          <Overlay>
            <Loader></Loader>
          </Overlay>
        )}
        <div className="edit-modal">
          <Modal show={this.props.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Actualizar instructor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='edit-modal__avatar-row'>
                <Image src={this.state.avatar ? this.state.avatar : noAvatar} alt='error' roundedCircle fluid />
              </div>
              <Form>
                <Row className='mt-2'>
                  <Col xs={{ span: 8, offset: 2 }} >
                    <div className="input-group mb-3 mt-3">
                      <div className="custom-file" lang='es'>
                        <label className="custom-file-label">Cambiar avatar</label>
                        <input type="file" className="custom-file-input" onChange={this.fileHandler} name="files" />
                      </div>
                    </div>
                  </Col>
                </Row>
                <Form.Group controlId="name">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control name='name' onChange={this.onChangeSelect} value={this.state.name} type="text" placeholder="Instroduzca el nombre" />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control name='email' onChange={this.onChangeSelect} value={this.state.email} type="text" placeholder="Instroduzca el correo" />
                </Form.Group>
                <Form.Group controlId="descripcion">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control name='description' onChange={this.onChangeSelect} value={this.state.description} type="text" placeholder="Descripción" />
                </Form.Group>
                <Row>
                  <Col xs={{ span: 4, offset: 4 }}>
                    <Button variant="primary" type="button" onClick={this.handleSubmit}>
                      Editar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default EditModal;
