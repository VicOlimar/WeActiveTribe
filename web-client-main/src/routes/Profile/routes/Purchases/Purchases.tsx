import React, { Component } from 'react';
import './Purchases.scss';
import ProfileInfo from '../../components/ProfileInfo';
import PurchasesImage from './../../assets/purchases.png';
import PurchasesServices from './../../../../api/Purchases';
import { Purchase } from './../../../../api/Purchases/Purchases';
import moment from 'moment';
import { getMoneyFormat } from '../../../../utils/money';
import SimpleAlert from '../../../../shared/SimpleAlert';

type Pagination = {
  pages: number,
  active: number,
  onClick: Function,
};
type Props = {};
type State = {
  purchases: Array<any>,
  pagination?: Pagination,
  loading: boolean,
  message: string,
  showMessage: boolean,
}

class Purchases extends Component<Props, State> {
  DATE_FORMAT = 'D [de] MMMM';
  EXP_DATE_FORMAT = 'DD/MM/YY';
  PAGE_SIZE = 10;
  state = {
    purchases: [],
    pagination: undefined,
    loading: false,
    message: '',
    showMessage: false,
  }

  componentDidMount() {
    this.setState({
      pagination: {
        pages: 1,
        active: 1,
        onClick: this.onPageClick,
      },
    }, () => this.getUserPurchases());
  }

  onPageClick = (page: number) => {
    this.getUserPurchases(page);
  }

  getUserPurchases = async (page: number = 1) => {
    let pagination = this.state.pagination! as Pagination;
    const purchases: { data: Purchase[], count: number } | string = await PurchasesServices.find(page, this.PAGE_SIZE);

    this.setState({ loading: true });

    if (typeof purchases === 'string') {
      this.setState({ loading: false, message: purchases, showMessage: true });
    } else {
      const mapedPurchases = purchases.data.map(purchase => {
        const date = moment(purchase.created_at).utcOffset("-06:00")
        return {
          label: `${date.format(this.DATE_FORMAT)}${` / ${this.getPlanName(purchase)}`} / ${getMoneyFormat(purchase.paid)} / EXP: ${this.getExpDate(purchase)}`,
          value: purchase.payment_type !== 'paypal' ? this.getCardLabel(purchase) : 'PayPal',
        };
      });

      pagination = {
        pages: Number(purchases.count) / this.PAGE_SIZE,
        active: page,
        onClick: this.onPageClick
      }
      this.setState({ purchases: mapedPurchases, loading: false, pagination });
    }
  }

  getPlanName(purchase: Purchase) {
    switch (purchase.plan_name) {
      case 'courtesy':
        return 'Cortesía';
      case 'courtesy-classic':
        return 'Cortesía';
      case 'courtesy-online':
        return 'Cortesía Online';
      default:
        return purchase.plan_name;
    }
  }

  getCardLabel(purchase: Purchase) {
    return `Tarjeta: ---- ---- ---- ${purchase.card_last4} / ${purchase.status !== 'paid' ? 'Declinada' : 'Aprobada'} / ${purchase.auth_code}`
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'paid':
        return ''
    }
  }

  getExpDate(purchase: Purchase) {
    let credits = purchase.credits || purchase.online_credits;
    return credits.length > 0 ? moment(credits[0].expires_at).utcOffset("-06:00").format(this.EXP_DATE_FORMAT) : 'N/A';
  }

  render() {
    const { loading, purchases, message, showMessage } = this.state;

    return (
      <div>
        <ProfileInfo image={PurchasesImage} rowsData={purchases} pagination={this.state.pagination} loading={loading} emptyText='Aún no se han hecho cargos' />
        <SimpleAlert title='' text={message} show={showMessage} onConfirm={() => this.setState({ message: '', showMessage: false })} />
      </div>
    )
  }
}

export default Purchases;