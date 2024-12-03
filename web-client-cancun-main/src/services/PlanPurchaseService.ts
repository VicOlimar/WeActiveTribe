import PlanService, { Plan, PlanPurcharseResponse } from '../api/Plan/Plan';
import CardsService, { Card } from '../api/Cards/CardsService';
import ReactGA from 'react-ga';

export interface PlanPurchaseResult {
  success: boolean;
  message?: string;
  errorMessage?: string;
}

export interface PaymentGatewayOptions {
  gatewayName: "stripe" | "conekta" | "paypal";
  isDefault?: boolean;
}

export const handlePlanPurchase = async (
  plan: Plan,
  values: any,
  gatewayResponse: any,
  paypal: any,
  code: string,
  paymentGatewayOptions: PaymentGatewayOptions
): Promise<PlanPurchaseResult> => {
  const { gatewayName, isDefault } = paymentGatewayOptions;
  if (values && values.card !== '' && plan) {
    const response: PlanPurcharseResponse | string = await PlanService.purchase(Number(plan.id), code, { cardId: values.card });
    return validatePlanPurchaseResponse(plan, response);
  } else if (gatewayResponse) {
    const card: Card | undefined = await CardsService.create(gatewayResponse.id, isDefault);
    if (card) {
      const purchaseData = gatewayName === 'stripe' ? { cardId: card.id.toString() } : { tokenId: gatewayResponse.id };
      const response: PlanPurcharseResponse | string = await PlanService.purchase(Number(plan.id), code, purchaseData);
      return validatePlanPurchaseResponse(plan, response);
    } else {
      return {
        success: false,
        errorMessage: 'Ocurrió un error al realizar tu pago, por favor intenta de nuevo, no se ha hecho ningún cargo a tu cuenta.'
      };
    }
  } else if (paypal) {
    const response = await PlanService.paypalPurchase(paypal.orderID, plan);
    return validatePlanPurchaseResponse(plan, response);
  }
  
  return {
    success: false,
    errorMessage: 'Invalid purchase method'
  };
};

const validatePlanPurchaseResponse = (plan: Plan, response: PlanPurcharseResponse | string): PlanPurchaseResult => {
  if (typeof response === 'string') {
    return {
      success: false,
      errorMessage: response
    };
  } else {
    ReactGA.event({
      category: 'User',
      action: `Compra del plan ${plan.name} por un precio de ${plan.price}`
    });
    return {
      success: true,
      message: `Se han agregado ${plan.credits} ${plan.credits > 1 ? 'clases' : 'clase'} a tu cuenta`
    };
  }
};