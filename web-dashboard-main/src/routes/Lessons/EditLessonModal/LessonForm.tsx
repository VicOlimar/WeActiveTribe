import React, { useState, useEffect } from 'react';
import { Col, Row, Button, Form as FormBootstrap } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Instructor } from '../../../api/Instructor/Instructor';
import Icon from '@mdi/react';
import { mdiPlusCircleOutline, mdiMinusCircleOutline } from '@mdi/js';
import * as Yup from 'yup';
import './EditLessonModal.scss';
import { Lesson } from '../../../api/Lesson/Lesson';
import { LessonType } from '../../../api/LessonType/LessonType';
const moment = require('moment');

interface InstructorNameAndId {
    name: string,
    id: number | string
}

interface timeUnit {
    name: string;
    value: string;
}

const schedule: timeUnit[] = [
    { name: 'AM', value: 'am' },
    { name: 'PM', value: 'pm' }
]

const timeValues: timeUnit[] = [
    { name: 'Minutos', value: 'm' },
    { name: 'Horas', value: 'h' }
];

type Props = {
    lessonTypes: LessonType[];
    show: boolean;
    lesson?: Lesson;
    needClearForm?: boolean;
    submitting: boolean;
    instructors: Instructor[];
    showMeetingUrl?: boolean;
    parentLevelClose: () => void;
    onSubmit: (
        id: number,
        name: string,
        instructors: number[],
        special: boolean,
        starts_at: Date,
        duration: number,
        unit: string,
        community: boolean,
        meeting_url: string | null,
        lesson_type: number | undefined,
        description: string | undefined) => void;
    onReset?: () => void;
}

type FormValues = {
    lesson_id: number;
    name: string | undefined;
    special: boolean | undefined;
    start: Date | undefined;
    start_hour: number;
    duration: number;
    unit: string;
    scheduleUnit: string;
    community: boolean;
    start_minutes: number;
    meeting_url: string | null;
    lesson_type: number | undefined;
    description: string | undefined;
};



const LessonForm = (props: Props) => {

    const [instructors, setInstructors] = useState<InstructorNameAndId[]>([]);

    useEffect(() => {
        if (props.show) {
            if (props.lesson) if (props.lesson.instructors)
                if (props.lesson.instructors.length > 0) {
                    const instructorsMap: InstructorNameAndId[] = props.lesson.instructors.map(instructor => {
                        return { name: instructor.name, id: instructor.id }
                    });
                    setInstructors(instructorsMap);
                }
        }
    }, [props.show, props.lesson]);

    const initialValues = {
        lesson_id: props.lesson!.id as number,
        meeting_url: props.lesson!.meeting_url as string || null,
        name: props.lesson!.name as string,
        special: props.lesson!.special ? props.lesson!.special : false,
        start: moment(props.lesson!.starts_at).format('YYYY-MM-DD'),
        duration: parseInt(moment(props.lesson!.ends_at).diff(moment(props.lesson!.starts_at), 'minutes')),
        unit: 'm',
        onSubmit: props.onSubmit,
        start_hour: (parseInt(moment(props.lesson!.starts_at).utcOffset("-06:00").format("HH")) >= 12) ?
            parseInt(moment(props.lesson!.starts_at).subtract(12, 'h').utcOffset("-06:00").format("HH")) :
            parseInt(moment(props.lesson!.starts_at).utcOffset("-06:00").format("HH")),
        start_minutes: moment(props.lesson!.starts_at).format('mm'),
        community: props.lesson ? props.lesson.community : false,
        scheduleUnit: moment(props.lesson!.ends_at).utcOffset("-06:00").format("HH") >= 12 ? 'pm' : 'am',
        lesson_type: props.lesson!.lesson_type_id || undefined,
        description: props.lesson!.description || undefined,
    }

    const onSubmit = (values: FormValues) => {
        if (instructors[0].id !== '') {
            let { start } = values;

            let starts_at = moment(`${start} ${values.start_hour}:${values.start_minutes}:00 ${values.scheduleUnit}`, 'YYYY-MM-DD h:m:s a');

            let instructorsCopy = [...instructors];

            let filteredInstructors = instructorsCopy.filter(instructor => {
                return instructor.id !== '';
            });
            const instructorsId = filteredInstructors.map(instructor => {
                return instructor.id!;
            });
            props.onSubmit(
                values.lesson_id,
                values.name ? values.name : '',
                instructorsId as number[],
                values.special!,
                starts_at.toDate(),
                values.duration,
                values.unit,
                values.community,
                values.meeting_url,
                values.lesson_type,
                values.description,
            );
        }
    }

    const renderInstructorsSelect = () => {
        if (props.instructors.length > 0) if (props.instructors[0]!.id! !== '') props.instructors.unshift({ name: 'Seleccione un instructor', description: '', avatar: null, id: '', email: '', experience: '' });
        return props.instructors.map(instructor => {
            const { id, name } = instructor;
            return <option value={id}>{name}</option>;
        });
    };

    const renderScheduleSelect = () => {
        return schedule.map(sch => {
            const { name, value } = sch;
            return <option value={value}>{name}</option>
        })
    };

    const renderTimeSelect = () => {
        return timeValues.map(timeValue => {
            const { name, value } = timeValue;
            return <option value={value}>{name}</option>
        })
    };

    const removeInstructor = (index: number) => {
        const arr = [...instructors];
        arr.splice(index, 1);
        return setInstructors(arr);
    }

    const incInstructorNumber = () => {
        const arr = [...instructors];
        arr.push({ name: '', id: '' });
        setInstructors(arr);
    }

    const getLessonTypeOptions = () => {
        const { lessonTypes } = props;
        if (lessonTypes) {
            return lessonTypes.map((lesson_type: LessonType) => <option key={lesson_type.id} value={lesson_type.id}>{lesson_type.name}</option>);
        }
        return null;
    }

    const getSelectedInstructor = (e: any, index?: number) => {
        const arr = [...instructors]
        const instructor = props.instructors.find(instructor => {
            return instructor.id === parseInt(e.currentTarget.value);
        })
        if (instructor) {
            if (index !== undefined) {
                arr[index] = {
                    id: instructor.id,
                    name: instructor.name
                }
            } else {
                arr[0] = {
                    id: instructor.id,
                    name: instructor.name
                }
            }
        }
        setInstructors(arr);
    }

    const lessonValidationSchema = Yup.object().shape({
        name: Yup.string(),
        special: Yup.boolean().required("Campo requerido"),
        meeting_url: Yup.string().nullable(),
        start_hour: Yup.number()
            .required("Campo requerido")
            .when('start', {
                is: (val) => (val !== undefined && moment(val).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')),
                then: Yup.number()
                    .when('scheduleUnit', {
                        is: (val) => (val === 'am' && (moment().format('HH') < 12)),
                        then: Yup.number()
                            .min(parseInt(moment().add(1, 'h').format('HH')), 'Solo se pueden crear clases después de la hora actual')
                            .max(12, 'Cambie el horario a PM'),
                        otherwise: Yup.number().min(1000, 'La hora debe ser posterior a la actual. Cambie el horario a PM')
                    })
                    .when('scheduleUnit', {
                        is: (val) => (val === 'pm'),
                        then: Yup.number().min((parseInt(moment().add(1, 'hour').format('HH')) - 12 > 0 ?
                            parseInt(moment().add(1, 'hour').format('HH')) - 12 :
                            0), 'Solo se pueden crear clases después de la hora actual'),
                    }),
            }),
        scheduleUnit: Yup.string().required('Campo requerido'),
        start: Yup.date().required("Campo requerido").min(moment().subtract(1, 'day'), 'Solo se pueden editar fechas posteriores a la actualidad'),
        duration: Yup.number().positive('Debe ser un número positivo').required("Campo requerido"),
        unit: Yup.string().required('Campo requerido'),
        community: Yup.boolean(),
        start_minutes: Yup.number().min(0, 'Los minutos deben ser positivos').max(59, 'Los minutos deben ser menores a 60'),
        lesson_type: Yup.string().nullable(),
        description: Yup.string().test('len', 'Debe ser máximo 400 caracteres', val => (val !== undefined && val.length <= 400) || (val === undefined)).nullable(),
    })

    const renderInstructorSelectors = () => {
        return instructors.map((instructor, index) => {
            if (index === 0) {
                return null;
            } else {
                return (
                    <Row style={{ marginTop: '20px' }}>
                        <Col xs={10}>
                            <FormBootstrap.Group controlId="instructors-list">
                                <FormBootstrap.Label>Instructores</FormBootstrap.Label>
                                <FormBootstrap.Control id={index.toString()} value={instructors[index].id as string} as="select" onChange={(e: any) => getSelectedInstructor(e, index)}>
                                    {renderInstructorsSelect()}
                                </FormBootstrap.Control>
                            </FormBootstrap.Group>
                        </Col>
                        <Col xs={2}>
                            <button className='lesson__clean-button' type='button' onClick={() => removeInstructor(index)} ><Icon
                                path={mdiMinusCircleOutline}
                                title='add'
                                size={1}
                                color={'#a50000'}
                            ></Icon>
                            </button>
                        </Col>
                    </Row>
                )
            }
        })
    }
    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={lessonValidationSchema}
        >
            {formProps => (
                <Form className={'lesson'}>

                    <Row>
                        <Col xs={12}>
                            <Field name={'name'}>
                                {({ field, form, data }: any) => (
                                    <div>
                                        <label htmlFor='name'>Nombre de la clase</label>
                                        <input {...field} type='text' className='form-control' id='name-input' onChange={(e: any) => formProps.setFieldValue('name', e.target.value)}></input>
                                    </div>
                                )}
                            </Field>
                            <ErrorMessage name="name" component="div" />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <br />
                            <Field name={'description'}>
                                {({ field, form, data }: any) => (
                                    <div>
                                        <label htmlFor='description'>Descripción de la clase (Opcional)</label>
                                        <textarea rows={2} className='form-control' id='description-input' onChange={(e: any) => formProps.setFieldValue('description', e.target.value)}>
                                            {field.value}
                                        </textarea>
                                    </div>
                                )}
                            </Field>
                            <ErrorMessage name="description" component="div" />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col xs={12}>
                            <Field name={'meeting_url'}>
                                {({ field, form, data }: any) => (
                                    <div>
                                        <label htmlFor='meeting_url'>Enlace de la clase</label>
                                        <input {...field} type='text' className='form-control' id='meeting-url-input' onChange={(e: any) => formProps.setFieldValue('meeting_url', e.target.value)}></input>
                                    </div>
                                )}
                            </Field>
                            <ErrorMessage name="meeting_url" component="div" />
                        </Col>
                    </Row>
                    {instructors[0] &&
                        <Row style={{ marginTop: '20px' }}>
                            <Col xs={10}>
                                <FormBootstrap.Group controlId="instructors-list">
                                    <FormBootstrap.Label>Instructores</FormBootstrap.Label>
                                    <FormBootstrap.Control value={instructors[0] ? instructors[0].id as string : ''} as="select" onChange={(e: any) => getSelectedInstructor(e)}>
                                        {renderInstructorsSelect()}
                                    </FormBootstrap.Control>
                                </FormBootstrap.Group>
                            </Col>
                            <Col xs={2}>
                                <button className='lesson__clean-button' type='button' onClick={() => incInstructorNumber()}><Icon
                                    path={mdiPlusCircleOutline}
                                    title='add'
                                    size={1}
                                    color={'#10a500'}
                                ></Icon>
                                </button>
                            </Col>
                        </Row>
                    }
                    {
                        (instructors[0] && instructors[0].id === '') ?
                            <Row style={{ marginTop: '-10px', marginBottom: '10px' }}>
                                <Col>
                                    <p>Debe seleccionar un instructor</p>
                                </Col>
                            </Row> :
                            null
                    }

                    {
                        renderInstructorSelectors()
                    }

                    <Row>
                        <Col xs={12}>
                            <label htmlFor="start">Fecha de inicio</label>
                            <Field className="form-control" type="date" name="start"></Field>
                            <ErrorMessage name="start" component="div"></ErrorMessage>
                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col>
                            <label htmlFor="time">Hora de inicio</label>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={4}>
                            <div className="form-group">
                                <Field name="start_hour">
                                    {({ field, form, data }: any) => (
                                        <div>
                                            <input type='number' {...field} min='0' max='12' className='form-control' id='hour-input' onChange={(e: any) => formProps.setFieldValue('start_hour', e.target.value)}></input>
                                        </div>
                                    )}
                                </Field>
                            </div>
                        </Col>
                        <span>:</span>
                        <Col xs={4}>
                            <div className="form-group">
                                <Field name="start_minutes">
                                    {({ field, form, data }: any) => (
                                        <div>
                                            <input type='number' {...field} min='0' max='59' className='form-control' id='minutes-input' onChange={(e: any) => formProps.setFieldValue('start_minutes', e.target.value)}></input>
                                        </div>
                                    )}
                                </Field>
                            </div>
                        </Col>
                        <Col xs={2}>
                            <div className="form-group">
                                <Field
                                    className="form-control"
                                    component="select"
                                    name="scheduleUnit"
                                >
                                    {renderScheduleSelect()}
                                </Field>
                            </div>
                        </Col>
                        <Col xs={12}>
                            <ErrorMessage name="start_hour" component="div" />
                            <ErrorMessage name="start_minutes" component="div" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label htmlFor="time">Duración</label>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={4}>
                            <div className="form-group">
                                <Field
                                    className="form-control"
                                    type="number"
                                    name="duration"
                                />
                            </div>
                        </Col>
                        <Col xs={4}>
                            <div className="form-group">
                                <Field
                                    className="form-control"
                                    component="select"
                                    name="unit"
                                >
                                    {renderTimeSelect()}
                                </Field>
                            </div>
                        </Col>
                        <Col xs={12}>
                            <ErrorMessage name="duration" component="div" />
                            <ErrorMessage name="unit" component="div" />
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={4}>
                            <label htmlFor="special">Especial</label> <br></br>
                        </Col>
                        <Col xs={2}>
                            <Field
                                name="special"
                                type="checkbox"
                                checked={formProps.values.special}
                                onChange={(e: any) => {
                                    formProps.setFieldValue("special", e.target.checked);
                                }}
                            ></Field>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <div className="form-group">
                                <label>Tipo de clases</label>
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
                    <Row>
                        <Col xs={4}>
                            <label htmlFor="community">Community</label> <br></br>
                        </Col>
                        <Col xs={2}>
                            <Field
                                name="community"
                                type="checkbox"
                                checked={formProps.values.community}
                                onChange={(e: any) => {
                                    formProps.setFieldValue("community", e.target.checked);
                                }}
                            ></Field>
                        </Col>
                    </Row>
                    <br></br>
                    <div className='button-row'>
                        <Button disabled={props.submitting} type='submit'>Actualizar</Button>
                        <Button type='button' onClick={props.parentLevelClose}>Cerrar</Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default LessonForm;