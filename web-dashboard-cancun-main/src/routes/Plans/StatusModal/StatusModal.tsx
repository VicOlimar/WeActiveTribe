import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import PlanService from "../../../api/Plan/Plan";

type Props = {
  show: boolean;
  name: string;
  id: number | null;
  status: boolean;
  statusMobile: boolean;
  remove?: boolean;
  parentLeveClose: () => void;
  parentLevelAlert: (
    error: boolean,
    message: string,
    alertVariant: string
  ) => void;
  type?: 'active' | 'active_mobile'
};

type State = {
  loading: boolean;
  error: boolean;
  message: string;
  alertVariant: string;
};

class StatusModal extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      message: "",
      alertVariant: "success",
    };
  }
  handleSubmit = async () => {
    try {
      if (this.props.id) {
        this.setState({ loading: true });
        if (!this.props.remove) {
          const active = this.props.type === 'active' ? !this.props.status : this.props.status;
          const active_mobile = this.props.type === 'active_mobile' ? !this.props.statusMobile : this.props.statusMobile;

          const response = await PlanService.changeStatus(this.props.id, active, active_mobile);
          if (response !== null) {
            this.props.parentLevelAlert(
              true,
              `Plan ${this.props.status ? 'desactivado' : 'activado'} con éxito!`,
              "success"
            );
            this.setState({ loading: false });
            this.props.parentLeveClose();
          }
        } else {
          const response = await PlanService.remove(this.props.id);
          if (response !== null) {
            this.props.parentLevelAlert(
              true,
              `Plan eliminado con éxito!`,
              "success"
            );
            this.setState({ loading: false });
            this.props.parentLeveClose();
          }
        }
      }
    } catch (error) {
      this.setState({ loading: false });
      this.props.parentLevelAlert(true, `Error`, "error");
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
    const { type } = this.props;
    return (
      <Modal show={this.props.show} onHide={this.props.parentLeveClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.props.remove && <p>Eliminar plan</p>}
            {this.props.status && !this.props.remove && <p>Desactivar plan {type === 'active' ? 'en web' : 'en app'}</p>}
            {!this.props.status && !this.props.remove && <p>Activar plan {type === 'active' ? 'en web' : 'en app'}</p>}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.props.remove && <p>Desea eliminar:  <b>{this.props.name}</b></p>}
          {this.props.status && !this.props.remove && <p>Desea desactivar:  <b>{this.props.name}</b></p>}
          {!this.props.status && !this.props.remove && <p>Desea activar:  <b>{this.props.name}</b></p>}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.parentLeveClose} variant="secondary">
            Cancelar
          </Button>
          <Button onClick={this.handleSubmit} disabled={this.state.loading} variant="primary">
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default StatusModal;
