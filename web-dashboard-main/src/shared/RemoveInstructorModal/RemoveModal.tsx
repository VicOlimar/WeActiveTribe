import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import InstructorService from "../../api/Instructor";

type Props = {
  show: boolean;
  name: string;
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
};

class RemoveModal extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      message: "",
      alertVariant: "success"
    };
  }
  handleRemove = async () => {
    try {
      if (this.props.id) {
        const response = await InstructorService.Remove(this.props.id);
        if (typeof response === 'number') {
          this.props.parentLevelAlert(
            true,
            "Instructor eliminado con éxito!",
            "success"
          );
          
          this.props.parentLeveClose();
        } else if (typeof response === 'string'){
            throw new Error(response);
        }
      }
    } catch (error) {
      this.props.parentLevelAlert(true, error.message, "warning");
      this.props.parentLeveClose();
    }
  };

  resetState = () => {
    this.setState({
      loading: false,
      error: false,
      message: "",
      alertVariant: "success"
    });
  };

  render() {
    return (
      <Modal show={this.props.show} onHide={()=>this.props.parentLeveClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar instructor</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Desea eliminar a {this.props.name}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.parentLeveClose} variant="secondary">
            Cancelar
          </Button>
          <Button onClick={this.handleRemove} variant="primary">
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default RemoveModal;
