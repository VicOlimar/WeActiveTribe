import React, { useState, useEffect } from 'react';
import { Switch, FormControlLabel, Typography } from '@material-ui/core';
import settingService from '../api/Setting/Setting';

const PaymentGatewaySwitch: React.FC = () => {
  const [paymentGateway, setPaymentGateway] = useState<'conekta' | 'stripe'>('stripe');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentGateway();
  }, []);

  const fetchCurrentGateway = async () => {
    try {
      const gateway = await settingService.getPaymentGateway();
      setPaymentGateway(gateway as 'conekta' | 'stripe');
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError('Error al obtener la pasarela actual: ' + error.message);
      } else {
        setError('Error desconocido al obtener la pasarela actual');
      }
    }
  };

  const handleSwitchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newGateway = event.target.checked ? 'stripe' : 'conekta';
    try {
      await settingService.updatePaymentGateway(newGateway);
      setPaymentGateway(newGateway);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError('Error al actualizar la pasarela de pago: ' + error.message);
      } else {
        setError('Error desconocido al actualizar la pasarela de pago');
      }
    }
  };

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={paymentGateway === 'stripe'}
            onChange={handleSwitchChange}
            name="paymentGatewaySwitch"
            color="primary"
          />
        }
        label={`Usar ${paymentGateway === 'stripe' ? 'Stripe' : 'Conekta'}`}
      />
      {error && (
        <Typography color="error" style={{ marginTop: '10px', fontSize: '0.8rem' }}>
          {error}
        </Typography>
      )}
    </>
  );
};

export default PaymentGatewaySwitch;