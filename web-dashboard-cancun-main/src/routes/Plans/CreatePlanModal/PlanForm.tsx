import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { ErrorMessage, withFormik, FormikProps, Form, Field } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.css';
import './CreatePlanModal.scss';
import { LessonType } from '../../../api/LessonType/LessonType';
import { Studio } from '../../../api/Studio/Studio';
import { ECreditType, EPlanExpiresUnit } from '../../../api/Plan/Plan';

interface timeUnit {
  name: string;
  value: string;
}

type Props = {
  studios: Studio[];
  lessonTypes?: LessonType[];
  onSubmit: (
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
  name: string;
  credits: number;
  price: number;
  expires_numbers: number;
  expires_unit: EPlanExpiresUnit;
  special: boolean;
  credit_type: ECreditType;
  lesson_type: number | undefined;
  studio: number | undefined;
  onSubmit: (
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
  name: Yup.string().required('Campo requerido'),
  credits: Yup.number()
    .positive('Ingrese números positivos')
    .required('Campo requerido'),
  price: Yup.number()
    .positive('Ingrese números positivos')
    .required('Campo requerido'),
  expires_numbers: Yup.number()
    .positive('Ingrese un número positivo')
    .required('Campo requerido'),
  expires_unit: Yup.string().required('Campo requerido'),
  special: Yup.boolean().required('Campo requerido'),
  lesson_type: Yup.mixed().notRequired(),
  studio: Yup.mixed().notRequired(),
});

const timeValues: timeUnit[] = [
  { name: 'Días', value: 'days' },
  { name: 'Meses', value: 'months' },
  { name: 'Años', value: 'years' },
];

const InnerForm = (
  props: Props & FormikProps<FormValues>,
  values: FormValues,
) => {
  const { isSubmitting, setFieldValue } = props;

  const renderTimeSelect = () => {
    return timeValues.map((timeValue) => {
      const { name, value } = timeValue;
      return <option value={value}>{name}</option>;
    });
  };

  const getLessonTypeOptions = () => {
    const { lessonTypes } = props;
    if (lessonTypes) {
      return lessonTypes.map((lesson_type: LessonType) => (
        <option key={lesson_type.id} value={lesson_type.id}>
          {lesson_type.name}
        </option>
      ));
    }
    return null;
  };

  const getStudioOptions = (): Array<any> => {
    const { studios } = props;
    const updateStudios = studios.filter(
      (studio: Studio) => studio.slug !== 'online',
    );
    if (studios) {
      return updateStudios.map((studio: Studio) => {
        return <option key={studio.id} value={studio.id}>{studio.name}</option>
      });
    }
    return [];
  };

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
            <Field className="form-control" type="number" name="credits" />
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
            <Field className="form-control" type="number" name="price" />
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
            <Field className="form-control" component="select" name="studio">
              <option value={undefined}>Todos</option>
              {getStudioOptions()}
            </Field>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="form-group">
            <label htmlFor="price">Tipo de créditos</label>
            <Field
              className="form-control"
              component="select"
              name="credit_type"
            >
              <option value="classic">Presencial</option>
              {/*<option value='online'>Online</option>*/}
            </Field>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="form-group">
            <label htmlFor="price">Tipo de clases a los que aplica</label>
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
            checked={values.special}
            name="special"
            type="checkbox"
            onChange={(e: any) => {
              setFieldValue('special', e.target.checked);
            }}
          ></Field>
        </Col>
      </Row>
      <div className="create-plan__button-row">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting}
        >
          Crear
        </button>
      </div>
    </Form>
  );
};

const PlanForm = withFormik<Props, FormValues>({
  mapPropsToValues: (props) => {
    return {
      name: '',
      credits: 0,
      lessons: 0,
      price: 0,
      expires_numbers: 0,
      expires_unit: EPlanExpiresUnit.DAYS,
      special: false,
      credit_type: ECreditType.CLASSIC,
      lesson_type: undefined,
      studio: undefined,
      onSubmit: props.onSubmit,
    };
  },

  validationSchema: formValidationSchema,

  handleSubmit: async (values) => {
    try {
      const {
        name,
        credits,
        price,
        expires_numbers,
        expires_unit,
        special,
        credit_type,
        studio,
        lesson_type,
      } = values;
      const lesson_type_value =
        lesson_type && String(lesson_type) !== 'Normales'
          ? lesson_type
          : undefined;
      const studio_value =
        studio && String(studio) !== 'Todos' ? studio : undefined;
      values.onSubmit(
        name!,
        credits!,
        price!,
        expires_numbers!,
        expires_unit,
        special,
        credit_type,
        lesson_type_value,
        studio_value,
      );
    } catch (error) {}
  },
})(InnerForm);

export default PlanForm;
