import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import LessonForm from './LessonForm';
import 'bootstrap/dist/css/bootstrap.css';
import InstructorService from '../../../api/Instructor/index';
import { Instructor, getIsntructorsResponse } from '../../../api/Instructor/Instructor';
import LessonService from '../../../api/Lesson/Lesson';
import { Studio } from '../../../api/Studio/Studio';
import './CreateLessonModal.scss';
import { LessonType } from '../../../api/LessonType/LessonType';

type Props = {
    lessonTypes: LessonType[];
    studio: Studio;
    show: boolean;
    showMeetingUrl?: boolean;
    parentHandleClose: () => void;
    parentHandleAlert: (error: boolean, message: string, alertVariant: string) => void;
}



const CreateLessonModal = (props: Props) => {
    const { show, showMeetingUrl = false } = props;

    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function find(): Promise<Instructor[] | undefined> {
            const instructorsResponse: getIsntructorsResponse | undefined = await InstructorService.find(100, 0);
            if (instructorsResponse) {
                return instructorsResponse.instructors;
            } else {
                return undefined;
            }
        }

        if (show) {
            find().then((instructors) => {
                if (instructors) setInstructors(instructors!);
            });
        }
    }, [show])

    const onSubmit = async (
        name: string,
        instructors: number[],
        special: boolean,
        starts_at: Date,
        duration: number,
        unit: string,
        community: boolean,
        meeting_url: string | null,
        lesson_type: number | undefined,
        description: string | undefined,
    ) => {
        try {
            setIsSubmitting(true);
            const response = await LessonService.create(
                props.studio.slug,
                name,
                instructors,
                special,
                starts_at,
                duration,
                unit,
                community,
                meeting_url,
                lesson_type,
                description);
            if (response) {
                if (typeof (response) !== 'string') {
                    props.parentHandleAlert(true, 'Clase creada correctamente', 'success');
                    props.parentHandleClose();
                } else {
                    throw new Error(response);
                }
            } else {
                throw new Error(response);
            }
            setIsSubmitting(false);
        } catch (error) {
            setIsSubmitting(false);
            if (error.message === 'hours_overlap') {
                props.parentHandleAlert(true, 'Existe traslape de horas. Elija una hora diferente', 'error');
            } else {
                props.parentHandleAlert(true, error.message, 'error');
            }
        }
    }
    return (
        <div className='lesson-modal'>
            <Modal show={props.show} onHide={props.parentHandleClose}>
                <Modal.Header>
                    <Modal.Title>Crear clase</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LessonForm
                        lessonTypes={props.lessonTypes}
                        submitting={isSubmitting}
                        onSubmit={onSubmit}
                        instructors={instructors}
                        needClearForm={true}
                        onReset={() => { }}
                        showMeetingUrl={showMeetingUrl}
                    ></LessonForm>
                </Modal.Body>
            </Modal>
        </div>
    );

}


export default CreateLessonModal;