import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { Purchase } from "../../../../api/Purchases/Purchases";
import PurchaseService from "../../../../api/Purchases";
import moment from 'moment';
import UserService from '../../../../api/Users';

type Props = {
  show: boolean;
  id: number | undefined;
  parentHandleClose: () => void;
  parentHandleAlert: (
    error: boolean,
    message: string,
    alertVarint: string
  ) => void;
};

type State = {
  loading: boolean;
  error: boolean;
  message: string;
  alertVariant: string;
  purchase: Purchase | undefined;
  username: string;
};

class InfoModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      message: "",
      alertVariant: "",
      purchase: undefined,
      username: ''
    };
  }

  DATE_FORMAT = 'D [de] MMMM [de] YYYY [-] h:mm A';


  async componentDidUpdate(prevProps: Props) {
    try {
      if (this.props.show !== prevProps.show) {
        if (this.props.id) {
          const response = await PurchaseService.findOne(this.props.id);
          if (response) {
            const user = await UserService.findOne(response.data.user_id);
            if (user!.user) {
              this.setState({ purchase: response.data, username: user!.user.name });
            } else {
              this.props.parentHandleAlert(true, 'El usuario no existe en la base de datos', 'error');
              this.props.parentHandleClose();
            }
          } else {
            this.props.parentHandleAlert(true, 'Error cargando la información del pago.','error');
            this.props.parentHandleClose(); 
          }
        }
      }
    } catch (error) {
      this.props.parentHandleClose();
      this.props.parentHandleAlert(true, "Error cargando la información de pago", "error");
    }
  }

  render() {
    let { purchase, username } = this.state;
    return (
      <Modal show={this.props.show}>
        <Modal.Header>
          <Modal.Title>Información de pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><b>Nombre de usuario:</b> {username}</p>
          <p><b>Código de autorización:</b> {purchase ? purchase.auth_code : ""}</p>
          <p><b>Fecha de pago:</b> {purchase ? moment(purchase.created_at).format(this.DATE_FORMAT) : ""}</p>
          <p><b>Tipo de tarjeta:</b> {purchase ? 
                        purchase.card_type === 'cash' ? 'Efectivo' 
                        : purchase.card_type === 'credit-card'? 'Tarjeta de crédito' 
                        : purchase.card_type === 'paypal' ? 'Pay-pal'
                        : purchase.card_type === 'conekta'? 'Conekta'
                        : purchase.card_type : ""}</p>
          <p><b>Ultimos cuatro dígitos:</b> {purchase ? purchase.card_last4 : ""}</p>
          <p><b>Compañia de tarjeta:</b> {purchase ? purchase.card_brand === 'cash' ? 'Efectivo' : (purchase.card_brand).charAt(0).toUpperCase() + purchase.card_brand.slice(1) : ""}</p>
          <p><b>Cantidad pagada:</b> {purchase ? purchase.paid : ""} {purchase ? purchase.currency : ''}</p>
          <p><b>Fecha de expiración:</b> {purchase ? moment(purchase.expires_at).format(this.DATE_FORMAT) : ""}</p>
          <p><b>Cuota:</b> {purchase ? purchase.fee : ""}</p>
          <p><b>Id de compra:</b> {purchase ? purchase.order_id : ""}</p>
          <p><b>Fecha de procesamiento:</b> {purchase ? moment(purchase.processed_at).format(this.DATE_FORMAT) : ""}</p>
          <p><b>Estatus de la compra:</b> {purchase ? purchase.status === 'paid' ? 'Pagado' : purchase.status === 'declined' ? 'Declinado' : purchase.status : ''}</p>
          <p><b>Créditos:</b> {purchase ? purchase.total_credits : ""}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.parentHandleClose}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default InfoModal;

