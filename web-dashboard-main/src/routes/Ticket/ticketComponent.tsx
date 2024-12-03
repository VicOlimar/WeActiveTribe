import React, { Component } from 'react';
import { Purchase } from '../../api/Purchases/Purchases';
import weActiveImage from './images/we-active.png';
import moment from 'moment';
import UserService from '../../api/Users';
import PlanService from '../../api/Plan/Plan';
import { User } from '../../api/Users/Users';
import { Plan } from '../../api/Plan/Plan';
import './ticketComponent.scss';

type Props = {
    purchase: Purchase
}
type State = {
    user: User | undefined;
    plan: Plan | undefined;
}

class TicketComponent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            user: undefined,
            plan: undefined
        }
    }
    async componentDidMount() {
        const user = await UserService.findOne(this.props.purchase.user_id);
        if (user!.user) {
            this.setState({ user: user!.user });
        }
        const plan = await PlanService.findOne(this.props.purchase.plan_id);
        if (plan) {
            if (typeof plan !== 'string') {
                this.setState({ plan: plan as Plan });
            }
        }
    }

    cardTypeTranslate(card_type: string) {
        switch (card_type) {
            case 'cash':
                return 'Efectivo';
            case 'credit-card':
                return 'Tarjeta de crédito';
            case 'paypal':
                return 'Pay-pal';
            case 'conekta':
                return 'Conekta'
        }
    }

    capitalizeFirstLetter(word: string) {
        if (word) return (word.toString().charAt(0).toUpperCase() + word.slice(1));
    }

    validatePurchase(purchase: Purchase) {
        if (purchase) {
            return (
                <React.Fragment>
                    <td>{purchase.id}</td>
                    <td>{`$ ${purchase.paid}`}</td>
                    <td>{purchase.order_id}</td>
                    <td>{this.cardTypeTranslate(purchase.card_type)}</td>
                </React.Fragment>
            )
        }
    }

    validateUser(user: User) {
        if (user) {
            return (
                <React.Fragment>
                    <p><b>Nombre: </b>{this.capitalizeFirstLetter(user!.name)! + ' ' + this.capitalizeFirstLetter(user!.last_name)!}</p>
                    <p><b>Correo: </b>{(user!.email)}</p>
                </React.Fragment>
            )
        }
    }

    render() {
        const { purchase } = this.props;
        const { user, plan } = this.state;
        return (
            <React.Fragment>
                <div className='ticket-component'>
                    <div className='ticket-component__layout'>
                        <div className='ticket-component__layout__header'>
                            <div className='ticket-component__layout__header__logo'>
                                <img src={weActiveImage} alt='we-active'></img>
                            </div>
                            <div className='ticket-component__layout__header__date'>
                                <p><b>Fecha: </b>{moment().format('DD-MM-YYYY')}</p>
                            </div>
                        </div>
                        <div className='ticket-component__layout__title'>
                            <h1>Ticket de compra</h1>
                        </div>
                        <div className='ticket-component__layout__info'>
                            <div className='ticket-component__layout__info__client-data'>
                                <h4>Datos del cliente:</h4>
                                {
                                    user && this.validateUser(user)
                                }
                            </div>
                            <div className='ticket-component__layout__info__contact-data'>
                                <h4>Contacto:</h4>
                                <p>CEL: 999 291 6336</p>
                                <p>L-V 6:30-11 am y 5:30-9pm</p>
                                <p>Sábado 8:30 am a 1 pm</p>
                                <p>Domingo 9:30 am a 1 pm</p>
                            </div>
                        </div>
                        <div className='ticket-component__layout__purchase-table'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Plan</th>
                                        <th>Identificador</th>
                                        <th>Pago</th>
                                        <th>Referencia</th>
                                        <th>Forma de pago</th>
                                    </tr>
                                    <tr>
                                        <td>{plan && plan.name}</td>
                                        {
                                            this.validatePurchase(purchase)
                                        }
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div className='ticket-component__layout__resume-table'>
                            <p><b>Total:</b></p><p>$ {purchase.paid}</p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default TicketComponent;


