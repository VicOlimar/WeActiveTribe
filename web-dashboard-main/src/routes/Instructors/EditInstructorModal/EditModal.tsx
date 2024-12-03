import React, { Component } from "react";
import { Modal, Col, Row, Button, Form, Image, FormCheck } from "react-bootstrap";
import InstructorService from "../../../api/Instructor";
import "./EditModal.scss";
import noAvatar from './images/noAvatar.svg';
import loadGif from './images/loader.gif';
import Overlay from '../../../shared/ovelay/index';
import Loader from '../../../shared/Loader/index';

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
  error: boolean;
  message: string;
  alertVariant: string;
  name: string;
  email: string;
  description: string;
  phrase: string;
  descriptionText: string;
  selectedFile: any;
  avatar: any | undefined;
  loadingAvatar: boolean;
  experience: string;
};

class EditModal extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      message: "",
      alertVariant: "",
      name: "",
      email: "",
      description: "",
      selectedFile: null,
      avatar: undefined,
      phrase: '',
      descriptionText: '',
      loadingAvatar: false,
      experience: '',
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClose() {
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
        this.setState({ loadingAvatar: false });
      } else {
        this.props.parentLevelAlert(
          true,
          "No se pudo cargar el avatar",
          "warning"
        );
        this.setState({ loadingAvatar: false });
      }
    } catch (error) {
      this.props.parentLevelAlert(
        true,
        "Error cargando el avatar",
        "error"
      );
      this.setState({ loadingAvatar: false });
    }
  }

  splitDescription = (description: string) => {
    let phrase: string;
    let descriptionText: string;
    if (description.includes('<h2>')) {
      phrase = description.split('<h2>')[1].split('</h2>')[0];
      this.setState({ phrase });
    }
    if (description.includes('<p>')) {
      descriptionText = description.split('<p>')[1].split('</p>')[0]
      this.setState({ descriptionText });
    };
    if (!description.includes('<h2>') && !description.includes('<p>')) {
      this.setState({ descriptionText: description });
    }
  }

  handleSubmit = async () => {
    try {
      const description = `<h2>${this.state.phrase}</h2> <p>${this.state.descriptionText}</p>`;
      await this.setState({ description });
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
        this.resetState();
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
        if (response.description) this.splitDescription(response.description);
        this.setState({
          name: response.name,
          avatar: response.avatar,
          email: response.email,
          experience: response.experience
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
      descriptionText: '',
      phrase: '',
      email: ''
    });
  }

  onChange = (e: any) => {
    const { currentTarget } = e;
    const { name, value, email } = currentTarget;
    const obj: any = { [name]: value, email };
    this.setState(obj);
  };

  fileHandler = (e: any) => {
    this.setState({ loadingAvatar: true });
    if (typeof FileReader !== "undefined") {
      var size = e.target.files[0].size;
      if (size > 1000000) {
        this.props.parentLevelAlert(true, 'El tamaño de la imagen excede 1MB, elija un archivo mas pequeño', 'warning');
        this.setState({ loadingAvatar: false });
        return;
      }
    }

    this.setState({ selectedFile: e.target.files[0] }, () => {
      this.uploadAvatar();
      this.getInstructor();
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
                <Image src={this.state.loadingAvatar ? loadGif : this.state.avatar ? this.state.avatar : noAvatar} alt='error' roundedCircle fluid />
              </div>
              <Form>
                <Row className='mt-2'>
                  <Col xs={{ span: 8, offset: 2 }} >
                    <div className="input-group mb-3 mt-3">
                      <div className="custom-file" lang='es'>
                        <label className="custom-file-label">Cambiar avatar</label>
                        <input type="file" className="custom-file-input" accept="image/*" onChange={this.fileHandler} name="files" />
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
                  <Form.Control name='email' onChange={this.onChangeSelect} value={this.state.email} type="text" placeholder="Correo" />
                </Form.Group>
                <Form.Group controlId="phrase">
                  <Form.Label>Frase</Form.Label>
                  <Form.Control name='phrase' onChange={this.onChangeSelect} value={this.state.phrase} type="text" placeholder="Descripción" />
                </Form.Group>
                <Form.Group controlId="descripcionText">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control name='descriptionText' onChange={this.onChangeSelect} value={this.state.descriptionText} type="text" placeholder="Descripción" />
                </Form.Group>
                <Form.Group controlId="experience">
                  <Form.Label>Experiencia</Form.Label>
                  <br />
                  <FormCheck
                    inline
                    defaultValue={this.state.experience}
                    type='radio'
                    label='Senior'
                    value='Senior'
                    checked={this.state.experience === 'Senior'}
                    name="experience"
                    onChange={this.onChangeSelect}
                  />
                  <FormCheck
                    inline
                    defaultValue={this.state.experience}
                    type='radio'
                    label='Junior'
                    value='Junior'
                    checked={this.state.experience === 'Junior'}
                    name="experience"
                    onChange={this.onChangeSelect}
                  />
                </Form.Group>
                <div className='edit-modal__button-row'>
                  <Button variant="primary" type="button" onClick={this.handleSubmit}>
                    Actualizar
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default EditModal;
