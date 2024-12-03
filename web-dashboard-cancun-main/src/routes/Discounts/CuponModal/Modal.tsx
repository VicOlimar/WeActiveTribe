import React from "react";
import { Modal, Col, Row, Button } from "react-bootstrap";
import DiscountsService from "../../../api/Discounts";
import { ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "../../../shared/Select";
import { withFormik, FormikProps, Form, Field } from "formik";
import "bootstrap/dist/css/bootstrap.css";

interface Props {
  show: boolean;
  parentLevelClose: () => void;
  parentLevelAlert: (
    error: boolean,
    message: string,
    alertVariant: string
  ) => void;
}

// Shape of form values
interface FormValues {
  code: string;
  total_uses: number;
  discount: number;
  type: string;
  expires_after: Date;
  option: string | null;
  parentLevelAlert: (
    error: boolean,
    message: string,
    alertVariant: string
  ) => void;
  parentLevelClose: () => void;
}

type Option = {
  label: string;
  value: string | number;
};

const options: Option[] = [
  { label: "Porcentaje", value: "percentage" },
  { label: "Cantidad", value: "amount" }
];

const formValidationSchema = Yup.object().shape({
  code: Yup.string().required("Campo requerido"),
  total_uses: Yup.number().required("Campo requerido"),
  discount: Yup.number().required("Campo requerido"),
  type: Yup.string().required("Campo requerido"),
  expires_after: Yup.date(),
  option: Yup.string().required("Campo requerido")
});

// Aside: You may see InjectedFormikProps<OtherProps, FormValues> instead of what comes below in older code.. InjectedFormikProps was artifact of when Formik only exported a HoC. It is also less flexible as it MUST wrap all props (it passes them through).
const InnerForm = (props: Props & FormikProps<FormValues>) => {
  const { isSubmitting } = props;
  return (
    <Form>
      <Row className="mt-2">
        <Col xs={12}>
          <div className="form-group">
            <label htmlFor="email">Código</label>
            <Field className="form-control" type="string" name="code" />
            <ErrorMessage name="code" component="div" />
          </div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xs={12}>
          <div className="form-group">
            <label htmlFor="email">Cantidad de usos</label>
            <Field
              className="form-control"
              type="number"
              name="total_uses"
            />
            <ErrorMessage name="total_uses" component="div" />
          </div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xs={12}>
          <div className="form-group">
            <label htmlFor="email">Descuento</label>
            <Field
              className="form-control"
              type="number"
              name="discount"
            />
            <ErrorMessage name="discount" component="div" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Select
            label={""}
            name={"type"}
            placeholder="Seleccione un tipo"
            required={true}
            value={props.values.option}
            options={options}
            onChange={(e: any) => {
              props.setFieldValue("type", e.target.value);
            }}
            defaultLabel="Seleciona un tipo de descuento"
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xs={12}>
          <label htmlFor="email">Válido hasta</label>
          <Field
            className="form-control"
            type="date"
            name="expires_after"
          />
          <ErrorMessage name="expires_after" component="div" />
        </Col>
      </Row>
      <div className='button-row'>
        <Button
          className="create-modal__button"
          type="submit"
          disabled={isSubmitting}
        >
          Crear
          </Button>
      </div>

    </Form>
  );
};

// Wrap our form with the using withFormik HoC
const MyForm = withFormik<Props, FormValues>({
  mapPropsToValues: props => {
    return {
      code: "",
      total_uses: 0,
      discount: 0,
      type: "",
      expires_after: new Date(),
      option: null,
      parentLevelAlert: props.parentLevelAlert,
      parentLevelClose: props.parentLevelClose
    };
  },
  // Add a custom validation function (this can be async too!)
  validationSchema: { formValidationSchema },

  handleSubmit: async values => {
    try {
      const { code, total_uses, discount, type, expires_after } = values;
      const response = await DiscountsService.create(
        code,
        total_uses,
        discount,
        type,
        expires_after
      );
      if (response) {
        if (response.code === code) {
          values.parentLevelAlert(true, "Cupon creado correctamente", "success");
          values.parentLevelClose();
        }
      }
    } catch (error) {
      values.parentLevelAlert(true, "Error creando cupón", "error");
    }
  }
})(InnerForm);

// Use <MyForm /> wherevs
const DiscountModal = ({ show, parentLevelClose, parentLevelAlert }: Props) => {
  return (
    <div className="create-modal">
      <Modal show={show} onHide={parentLevelClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear cupón</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MyForm
            show={show}
            parentLevelClose={parentLevelClose}
            parentLevelAlert={parentLevelAlert}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DiscountModal;
