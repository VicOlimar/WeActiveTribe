import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PlanService, { Plan, PlansArrayResponse } from '../../../api/Plan/Plan';
import { Button, Col, Row } from 'react-bootstrap';
import Select from '../../../shared/Select';
import * as Yup from 'yup';

type Option = {
  label: string;
  value: string | number;
};

type Props = {
  show: boolean;
  parentLevelAlert: (
    error: boolean,
    message: string,
    alertVariant: string,
  ) => void;
  onSubmit: (
    opMethod: string,
    opPlan: number | null,
    credits: number | null,
    paid: number | null,
    authCode: string,
    credit_type?: 'online' | 'classic',
  ) => void;
};

interface FormValues {
  paid: number;
  authCode: string;
  opMethod: string;
  opPlan: number | null;
  credits: number | null;
  credit_type?: 'online' | 'classic';
}

const ChargeForm = (props: Props) => {
  const isSubmitting = false;

  const planOptions: Option[] = [];
  const methodOptions: Option[] = [
    { label: 'Efectivo', value: 'cash' },
    { label: 'Tarjeta de crédito', value: 'credit-card' },
    { label: 'Cortesía', value: 'courtesy' },
    { label: 'Terminal', value: 'terminal' },
  ];

  const initialValues: FormValues = {
    paid: 0,
    authCode: '',
    opMethod: '',
    opPlan: null,
    credits: 0,
    credit_type: 'classic',
  };

  useEffect(() => {
    async function find(): Promise<Plan[] | String> {
      const plansResponse: PlansArrayResponse | String = await PlanService.find(
        100,
        0,
      );
      if (typeof plansResponse !== 'string') {
        const { plans } = plansResponse as PlansArrayResponse;
        return plans;
      } else {
        return plansResponse;
      }
    }

    if (props.show) {
      find().then((plans) => {
        if (typeof plans !== 'string') {
          plans = plans as Plan[];
          plans.map((plan) => {
            return planOptions.push({
              label: `${plan.name} ($${plan.price})`,
              value: plan.id,
            });
          });
        } else {
          props.parentLevelAlert(true, plans, 'warning');
        }
      });
    }
  });

  const onSubmit = (values: FormValues) => {
    const { opMethod, opPlan, credits, paid, authCode, credit_type } = values;
    props.onSubmit(
      opMethod,
      opPlan,
      credits,
      paid === 0 ? null : paid,
      authCode,
      credit_type,
    );
  };

  const formValidationSchema = Yup.object().shape({
    opMethod: Yup.string().required('Campo requerido'),
    opPlan: Yup.number().when('opMethod', {
      is: 'courtesy',
      then: Yup.number().notRequired().nullable(),
      otherwise: Yup.number().required('Seleccione un plan'),
    }),
    authCode: Yup.string().when('opMethod', {
      is: 'credit-card',
      then: Yup.string().required('Campo requerido'),
      otherwise: Yup.string().notRequired().nullable(),
    }),
    paid: Yup.number().notRequired(),
    credits: Yup.number().when('opMethod', {
      is: 'courtesy',
      then: Yup.number()
        .min(1, 'Debe asignar por lo menos 1 crédito')
        .required('Campo requerido'),
      otherwise: Yup.number().notRequired().nullable(),
    }),
    credit_type: Yup.string(),
  });

  return (
    <React.Fragment>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={formValidationSchema}
      >
        {(formProps) => (
          <Form>
            <Row>
              <Col xs={12}>
                <Select
                  label={''}
                  name={'opMethod'}
                  placeholder="Seleccione un método de pago"
                  required={true}
                  value={formProps.values.opMethod}
                  options={methodOptions}
                  onChange={(e: any) => {
                    formProps.setFieldValue('opMethod', e.target.value);
                  }}
                  defaultLabel="Seleccione un método de pago"
                />
              </Col>
            </Row>
            {(formProps.values.opMethod === 'credit-card' ||
              formProps.values.opMethod === 'terminal' ||
              formProps.values.opMethod === 'cash') &&
              planOptions && (
                //validation credit_card, cash
                <Row>
                  <Col xs={12}>
                    <Select
                      label={''}
                      name={'opPlan'}
                      placeholder="Selecciona un plan"
                      required={true}
                      value={formProps.values.opPlan}
                      options={planOptions}
                      onChange={(e: any) => {
                        formProps.setFieldValue('opPlan', e.target.value);
                      }}
                      defaultLabel="Selecciona un plan"
                    />
                  </Col>
                </Row>
              )}
            {(formProps.values.opMethod === 'credit-card' ||
             formProps.values.opMethod === 'terminal') && (
              <Row className="mt-2">
                <Col xs={12}>
                  <div className="form-group">
                    <label htmlFor="email">Código de autorización</label>
                    <Field
                      className="form-control"
                      type="string"
                      name="authCode"
                    />
                    <ErrorMessage name="authCode" component="div" />
                  </div>
                </Col>
              </Row>
            )}
            {(formProps.values.opMethod === 'credit-card' ||
              formProps.values.opMethod === 'terminal' ||
              formProps.values.opMethod === 'cash') && (
              <Row className="mt-2">
                <Col xs={12}>
                  <div className="form-group">
                    <label htmlFor="email">
                      Cantidad Pagada (Dejar en blanco para tomar el precio del
                      plan)
                    </label>
                    <Field className="form-control" type="number" name="paid" />
                    <ErrorMessage name="paid" component="div" />
                  </div>
                </Col>
              </Row>
            )}
            {formProps.values.opMethod === 'courtesy' && (
              //validation courtesy
              <Row className="mt-2">
                <Col xs={12}>
                  <div className="form-group">
                    <label htmlFor="credit_type">Tipo de cortesía</label>
                    <Field
                      className="form-control"
                      component="select"
                      name="credit_type"
                    >
                      <option value="classic">Presencial</option>
                      {/*Uncomment if necessary
                                            <option value='online'>Online</option>
                                            */}
                    </Field>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="form-group">
                    <label htmlFor="email">Créditos</label>
                    <Field
                      className="form-control"
                      type="number"
                      name="credits"
                    />
                    <ErrorMessage name="credits" component="div" />
                  </div>
                </Col>
              </Row>
            )}
            <div className="button-row">
              <Button
                className="create-modal__button"
                type="submit"
                disabled={isSubmitting}
              >
                Crear
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};

export default ChargeForm;
