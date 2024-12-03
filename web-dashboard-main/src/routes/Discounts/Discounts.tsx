import React, { Component } from "react";
import DiscountService from "../../api/Discounts/index";
import { Cupon, CouponResponse } from "../../api/Discounts/Discount";
import { Button, Card, Container, Alert as BootstrapAlert } from "react-bootstrap";
import DiscountModal from "./CuponModal";
import DeactivateModal from "./DeactivateModal/index";
import Alert from '../../shared/alert';
import "./Discounts.scss";
import moment from 'moment';
import HorizontalLine from '../../shared/HorizontalLine/HorizontalLine';
import Overlay from '../../shared/ovelay';
import Loader from '../../shared/Loader';
import { withRouterContext } from '../../contexts/RouteContext';
import { DefaultRouteContext } from "../../contexts/RouteContext/RouteContext";
import { RouteComponentProps } from 'react-router';

type Props = RouteComponentProps & {
  routeContext?: DefaultRouteContext;
};
type State = {
  loading: boolean;
  error: boolean;
  message: string;
  alertVariant: string;
  pages: number;
  perPage: number;
  activePage: number;
  discounts: Cupon[] | undefined;
  showNew: boolean;
  count: number;
  cupon: Cupon | undefined;
  showDeactivate: boolean;
};

const DATE_FORMAT = 'D [de] MMMM [del] YYYY';

class Discounts extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      message: "",
      alertVariant: "success",
      pages: 1,
      perPage: 100,
      activePage: 1,
      discounts: undefined,
      showNew: false,
      count: 0,
      cupon: undefined,
      showDeactivate: false
    };
    this.renderCupons = this.renderCupons.bind(this);
  }

  async componentDidMount() {
    try {
      this.loadDiscounts();
    } catch (error) {
      this.setState({ loading: false });
    }
  }

  loadDiscounts = async () => {
    try {
      this.setState({ loading: true });
      const discountsResponse:
        | CouponResponse
        | undefined = await DiscountService.find(
          this.state.perPage,
          this.state.activePage
        );
      if (discountsResponse) {
        const { count, discounts } = discountsResponse;
        this.setState({ discounts, count, loading: false });
      }
    } catch (error) {
      this.setState({
        error: true,
        message: "Error cargando los cupones de descuento",
        alertVariant: "error",
        loading: false
      });
    }
  }

  handleShowModal = () => {
    this.setState({ showNew: true });
  };

  handleCloseNew = () => {
    this.setState({ showNew: false });
    this.loadDiscounts();
  };

  showAlert = (error: boolean, message: string, alertVariant: string) => {
    this.setState({ error, message, alertVariant });
  };

  ShowCuponInfo = (e: any) => {
    const { value } = e.currentTarget;
    const cupon = this.state.discounts!.find(el => el.id === parseInt(value))
    this.setState({ cupon: cupon }, () => {
      this.setState({ showDeactivate: true });
    });
  };

  handleCloseDeactivateModal = () => {
    this.setState({ showDeactivate: false });
    this.loadDiscounts();
  };

  renderCupons() {
    if (this.state.discounts) {
      return this.state.discounts.map(discountEl => {
        const {
          code,
          discount,
          expires_after,
          id,
          total_uses,
          type,
          active
        } = discountEl;
        return (
          <Button
            value={id}
            onClick={this.ShowCuponInfo}
            bsPrefix="discount__card-row__card-container"
          >
            <Card
              className="discount__card-row__card-container__card"
              style={{ width: "15rem" }}
            >
              <Card.Header>{code}</Card.Header>
              <Card.Body>
                <Card.Title>
                  {discount} {type === 'percentage' ? '%' : '$'} de descuento
                </Card.Title>
                <Card.Text>
                  <p>
                    <b>Límite de uso: </b>{total_uses}
                  </p>
                  <p>
                    <b>Fecha de expiración: </b> {moment.utc(expires_after).format(DATE_FORMAT)}
                  </p>
                  <br/>
                  <BootstrapAlert variant={active ? 'success' : 'secondary'} style={{zIndex: 1}}>{active ? 'Activo' : 'Desactivado'}</BootstrapAlert>
                </Card.Text>
              </Card.Body>
            </Card>
          </Button>
        );
      });
    }
  }

  closeAlert = () => {
    this.setState({ error: false, message: '', alertVariant: '' });
  }

  render() {
    return (
      <div className="discount">
        {this.state.error && (
          <Alert
            message={this.state.message}
            variant={this.state.alertVariant}
            parentHandleClose={this.closeAlert}
          ></Alert>
        )}
        <div className="discount__header">
          <h1 className='header-title'>CUPONES</h1>
        </div>
        <div className='discount__search-grid'>
          <Button className="discount__search-grid__new-button" style={{ height: '40px' }} onClick={this.handleShowModal}>Crear cupon</Button>
        </div>
        {this.state.loading &&
          <Overlay>
            <Loader></Loader>
          </Overlay>
        }
        <Container className="mt-5">
          <div className="discount__card-row">{this.renderCupons()}</div>
        </Container>
        <HorizontalLine></HorizontalLine>
        <DiscountModal
          show={this.state.showNew}
          parentLevelClose={this.handleCloseNew}
          parentLevelAlert={this.showAlert}
        ></DiscountModal>
        <DeactivateModal
          cupon={this.state.cupon}
          show={this.state.showDeactivate}
          parentLevelClose={this.handleCloseDeactivateModal}
          parentLevelAlert={this.showAlert}
        ></DeactivateModal>
      </div>
    );
  }
}

export default withRouterContext(Discounts);
