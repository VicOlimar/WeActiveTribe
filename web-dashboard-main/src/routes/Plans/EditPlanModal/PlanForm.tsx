import React from "react";
import { Col, Row } from "react-bootstrap";
import { ErrorMessage, withFormik, FormikProps, Form, Field } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.css";
import { ECreditType, EPlanExpiresUnit, Plan } from "../../../api/Plan/Plan";
import { LessonType } from "../../../api/LessonType/LessonType";
import { Studio } from "../../../api/Studio/Studio";

interface timeUnit {
  name: string;
  value: string;
}

type Props = {
  plan: Plan;
  studios: Studio[];
  lessonTypes: LessonType[];
  onSubmit: (
    id: number,
    name: string,
    credits: number,
    price: number,
    expires_numbers: number,
    expires_unit: EPlanExpiresUnit,
    special: boolean,
    credit_type: ECreditType,
    lesson_type: number | undefined,
    studio: number | undefined,
  ) => void;
};

type FormValues = {
  id: number,
  name: string,
  credits: number,
  price: number,
  expires_numbers: number,
  expires_unit: EPlanExpiresUnit,
  special: boolean,
  credit_type: ECreditType,
  lesson_type: number | undefined,
  studio: number | undefined
  onSubmit: (
    id: number,
    name: string,
    credits: number,
    price: number,
    expires_numbers: number,
    expires_unit: EPlanExpiresUnit,
    special: boolean,
    credit_type: ECreditType,
    lesson_type: number | undefined,
    studio: number | undefined,
  ) => void;
};

const formValidationSchema = Yup.object().shape({
  name: Yup.string().required("Campo requerido"),
  credits: Yup.number().positive('Ingrese números positivos').required("Campo requerido"),
  price: Yup.number().positive('Ingrese números positivos').required("Campo requerido"),
  expires_numbers: Yup.number().positive('Ingrese números positivo').required("Campo requerido"),
  expires_unit: Yup.string().required("Campo requerido"),
  special: Yup.boolean(),
  credit_type: Yup.string().required(),
  lesson_type: Yup.mixed().notRequired(),
  studio: Yup.mixed().notRequired(),
});


const timeValues: timeUnit[] = [
  { name: 'Días', value: 'days' },
  { name: 'Meses', value: 'months' },
  { name: 'Años', value: 'years' }
]

const InnerForm = (
  props: Props & FormikProps<FormValues>,
  values: FormValues
) => {
  const { isSubmitting, setFieldValue } = props;

  const renderTimeSelect = () => {
    return timeValues.map(timeValue => {
      const { name, value } = timeValue;
      return <option value={value}>{name}</option>
    })
  }

  const getLessonTypeOptions = () => {
    const { lessonTypes } = props;
    if (lessonTypes) {
      return lessonTypes.map((lesson_type: LessonType) => <option key={lesson_type.id} value={lesson_type.id}>{lesson_type.name}</option>);
    }
    return null;
  }

  const getStudioOptions = () => {
    const { studios } = props;
    if (studios) {
      return studios.map((studio: Studio) => <option key={studio.id} value={studio.id}>{studio.name}</option>);
    }
    return null;
  }

  return (
    <Form>
      <Row>
        <Col xs={12}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <Field className="form-control" type="string" name="name"></Field>
            <ErrorMessage name="name" component="div" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="form-group">
            <label htmlFor="credits">Clases</label>
            <Field
              className="form-control"
              type="number"
              name="credits"
            />
          </div>
        </Col>
        <Col xs={12}>
          <ErrorMessage name="credits" component="div" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <Field
              className="form-control"
              type="number"
              name="price"
            />
          </div>
        </Col>
        <Col xs={12}>
          <ErrorMessage name="price" component="div" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="form-group">
            <label htmlFor="price">¿A qué estudio aplica?</label>
            <Field
              className="form-control"
              component="select"
              name="studio"
            >
              <option value={undefined}>Todos</option>
              {getStudioOptions()}
            </Field>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="form-group">
            <label htmlFor="credit_type">Tipo de créditos</label>
            <Field
              className="form-control"
              component="select"
              name="credit_type"
            >
              <option value='classic'>Presencial</option>
              <option value='online'>Online</option>
            </Field>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="form-group">
            <label>Tipo de clases a los que aplica</label>
            <Field
              className="form-control"
              component="select"
              name="lesson_type"
            >
              <option value={undefined}>Normales</option>
              {getLessonTypeOptions()}
            </Field>
          </div>
        </Col>
      </Row>
      <label htmlFor="expires_numbers">Tiempo de expiración</label>
      <Row>
        <Col xs={4}>
          <div className="form-group">
            <Field
              className="form-control"
              type="number"
              name="expires_numbers"
            />
          </div>
        </Col>
        <Col xs={4}>
          <div className="form-group">
            <Field
              className="form-control"
              component="select"
              name="expires_unit"
            >
              {renderTimeSelect()}
            </Field>
          </div>
        </Col>
        <Col xs={12}>
          <ErrorMessage name="credits" component="div" />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <label htmlFor="instructor_id">Especial</label> <br></br>
        </Col>
        <Col xs={2}>
          <Field
            checked={props.values.special}
            name="special"
            type="checkbox"
            onChange={(e: any) => {
              setFieldValue("special", e.target.checked);
            }}
          ></Field>
        </Col>
      </Row>
      <Row className="mt-4 justify-content-md-center">
        <Col xs={{ span: 8, offset: 2 }}>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isSubmitting}
          >
            Actualizar
          </button>
        </Col>
      </Row>
    </Form>
  );
};

const PlanForm = withFormik<Props, FormValues>({
  mapPropsToValues: props => {
    return {
      id: props.plan.id as number,
      name: props.plan.name,
      credits: props.plan.credits,
      price: props.plan.price,
      expires_numbers: props.plan.expires_numbers,
      expires_unit: props.plan.expires_unit,
      special: props.plan.special || false,
      credit_type: props.plan.credit_type,
      lesson_type: props.plan.lesson_type_id || undefined,
      studio: props.plan.studio_id || undefined,
      onSubmit: props.onSubmit
    };
  },

  validationSchema: formValidationSchema,

  handleSubmit: async values => {
    try {
      const {
        id,
        name,
        credits,
        price,
        expires_numbers,
        expires_unit,
        special,
        credit_type,
        studio,
        lesson_type } = values;
      const lesson_type_value = lesson_type && String(lesson_type) !== 'Normales' ? lesson_type : undefined;
      const studio_value = studio && String(studio) !== 'Todos' ? studio : undefined;
      values.onSubmit(
        id!,
        name!,
        credits!,
        price!,
        expires_numbers!,
        expires_unit,
        special,
        credit_type,
        lesson_type_value,
        studio_value);
    } catch (error) {
      return null;
    }
  }
})(InnerForm);

export default PlanForm;
