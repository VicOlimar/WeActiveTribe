import React, { Component } from 'react';
import { match, RouteComponentProps } from "react-router-dom";
import { withRouterContext } from '../../contexts/RouteContext';
import { DefaultRouteContext } from "../../contexts/RouteContext/RouteContext";
import PurchaseService from '../../api/Purchases';
import { Purchase } from '../../api/Purchases/Purchases';
import './Ticket.scss';
import Return from '../../shared/ReturnBtn';
import Alert from '../../shared/alert';
import { Overlay, Button } from 'react-bootstrap';
import Loader from '../../shared/Loader';
import HorizontalLine from '../../shared/HorizontalLine/HorizontalLine';
import ReactToPrint from 'react-to-print';
import TicketComponent from './ticketComponent';

type Props = RouteComponentProps<any> & {
    match: match<string>;
    routeContext?: DefaultRouteContext;
};

type State = {
    loading: boolean;
    error: boolean;
    message: string;
    alertVariant: string;
    purchase: Purchase | undefined;
}

class Ticket extends Component<Props, State> {
    componentRef: any = null;
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            error: false,
            message: '',
            alertVariant: '',
            purchase: undefined
        }
    }

    async componentDidMount() {
        try {
            let { id } = this.props.match.params;
            if (id) {
                const response = await PurchaseService.findOne(parseInt(id));
                if (response) this.setState({ purchase: response.data });
                else throw new Error('El pago no existe.');
            }

        } catch (error) {
            this.setState({ error: true, message: error.message, alertVariant: 'error' });
        }
    }

    closeAlert = () => {
        this.setState({ error: false, message: '', alertVariant: '' });
    }

    render() {
        return (
            <div className='ticket'>
                {this.state.error &&
                    <Overlay>
                        <Alert message={this.state.message} variant={this.state.alertVariant} parentHandleClose={this.closeAlert}></Alert>
                    </Overlay>}
                {this.state.loading &&
                    <Overlay>
                        <Loader></Loader>
                    </Overlay>
                }
                <div className='ticket__header-row'>
                    <h1 className='header-title'>TICKET</h1>
                </div>
                <Return goBackCallBack={this.props.routeContext ? this.props.routeContext.returnPrevRoute : undefined}></Return>
                <div className='ticket__layout'>
                    {this.state.purchase &&
                        <TicketComponent
                            purchase={this.state.purchase!}
                            ref={el => (this.componentRef = el)}
                        ></TicketComponent>
                    }
                </div>
                <HorizontalLine></HorizontalLine>
                <div className='ticket__print-btn-row'>
                    <ReactToPrint
                        trigger={() => <Button>Imprimir</Button>}
                        content={() => this.componentRef}
                    ></ReactToPrint>
                </div>
            </div>

        )
    }

}

export default withRouterContext(Ticket);