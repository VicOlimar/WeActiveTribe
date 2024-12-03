import React, { Component } from "react";
import { match, RouteComponentProps } from "react-router-dom";
import {
    Studio as StudioClass
} from "./../../api/Studio/Studio";
import "./Lessons.scss";
import lessonService, { Lesson } from "../../api/Lesson/Lesson";
import studioService, { Studio } from "../../api/Studio/Studio";
import Calendar from "../../shared/Calendar/Calendar";
import { Instructor } from "../../api/Instructor/Instructor";
import { isUndefined } from "util";
import { Button } from "react-bootstrap";
import moment from "moment-timezone";
import CreateLessonModal from "./CreateLessonModal/index";
import Alert from '../../shared/alert/index';
import Overlay from '../../shared/ovelay/index';
import EditLessonModal from "./EditLessonModal/index";
import Return from '../../shared/ReturnBtn/index';
import Loader from "../../shared/Loader/Loader";
import { withRouterContext } from '../../contexts/RouteContext';
import { DefaultRouteContext } from "../../contexts/RouteContext/RouteContext";
import LessonTypeService, { LessonType } from "../../api/LessonType/LessonType";

type Props = RouteComponentProps<any> & {
    match: match<string>;
    routeContext?: DefaultRouteContext;
};

type State = {
    loading: boolean;
    error: boolean;
    message: string;
    alertVariant: string;
    lessons: Lesson[];
    onClick?: Function;
    onPlanClick?: Function;
    loadingPlans?: boolean;
    instructors?: Instructor[];
    onInstructorClick?: Function;
    selectedInstructor?: Instructor;
    previousWeekClick?: Function;
    nextWeekClick?: Function;
    previewNextWeek?: boolean;
    selectedLesson?: Lesson;
    studio?: Studio;
    loadingLessons: boolean;
    showCreateModal: boolean;
    showEditModal: boolean;
    today: number;
    actualMonth: number;
    year: number;
    starts: any;
    ends: any;
    month: number;
    actualWeekStartDay: number;
    currentDate: any;
    lessonTypes: LessonType[];
};

class Lessons extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            error: false,
            message: "",
            alertVariant: "",
            lessons: [],
            loadingPlans: false,
            instructors: [],
            previewNextWeek: false,
            selectedLesson: undefined,
            studio: undefined,
            loadingLessons: false,
            showCreateModal: false,
            showEditModal: false,
            actualWeekStartDay: 0,
            currentDate: moment().utcOffset("-06:00").toDate(),
            today: +moment().format("DD"),
            actualMonth: ((moment().format("MM")) as unknown as number) - 1,
            year: +moment().format("YYYY"),
            starts: 0,
            ends: 0,
            month: 0,
            lessonTypes: [],
        };
    }
    async componentDidMount() {
        try {
            this.setState({ loading: true });
            if (this.props.location.state) {
                await this.setState({ currentDate: this.props.location.state });
            }

            let { slug } = this.props.match.params;
            if (slug) {
                const studio: Studio | undefined = await studioService.findOne(slug);
                if (studio) {
                    this.setState({ studio: studio });
                    await this.loadWeek(this.state.currentDate);
                }
            }
            this.getLessonTypes();
            this.setState({ loading: false });
        } catch (err) {
            this.setState({ error: true, message: err.message, alertVariant: 'error' });
            this.setState({ loading: false });
        }
    }

    getLessonTypes = async () => {
        try {
            const response = await LessonTypeService.list();
            this.setState({ lessonTypes: response });
        } catch (error) {
            this.setState({ error: true, message: 'Error al cargal los planes', alertVariant: 'error', loading: false });
        }
    }

    /**
     * Callback function for the calender when a plan is clicked
     * @param plan - <Plan> The plan selected
     */
    handleLessonClick = (lesson: Lesson) => {
        const { previewNextWeek } = this.state;
        const studio: StudioClass | undefined = this.state.studio;
        this.setState({ selectedLesson: lesson });
        if (lesson.available === 0 && studio) {
            this.props.history.push(`/studio/${studio.slug}/lesson/${lesson!.id}`, this.state.currentDate ? this.state.currentDate : null);
        } else if (studio) {
            if (!previewNextWeek) {
                this.props.history.push(`/studio/${studio.slug}/lesson/${lesson!.id}`, this.state.currentDate ? this.state.currentDate : null);
            }
        } else {
            this.props.history.push(`/`);
        }
    };

    /**
     * Function for filter the calendar view
     */
    filterCalendar = (instructor: Instructor) => {
        const selectedInstructor: Instructor | undefined = this.state
            .selectedInstructor;
        if (
            !isUndefined(selectedInstructor) &&
            selectedInstructor!.id === instructor.id
        ) {
            this.setState({ selectedInstructor: undefined });
        } else {
            this.setState({ selectedInstructor: instructor });
        }
    };

    /**
     * Load a week
     */

    loadWeek = async (date: Date) => {
        try {
            const { studio } = this.state;
            if (studio) {
                let start_date = moment(date)
                    .startOf("day");
                let end_date = moment(date)
                    .add(6, 'days')
                    .endOf("day");
                const lessons = await this.findLessonsByDate(
                    studio!,
                    start_date.toDate(),
                    end_date.toDate()
                );
                this.setState({
                    currentDate: date
                })
                if (lessons) {
                    this.setState({ lessons });
                }
            }
        } catch (error) { }
    };

    findLessonsByDate = async (studio: StudioClass, starts: any, ends: any) => {
        try {
            this.setState({ loadingLessons: true });
            const lessons = await lessonService.find(studio, starts, ends);
            this.setState({ loadingLessons: false });
            return lessons;
        } catch (error) {
            this.setState({ error: true, message: error.message, alertVariant: 'error', loadingLessons: false })
        }
    };

    /**
     * Find lesson by studio
     * @param studio - <Studio> A Studio
     */
    findLessons = async (studio: StudioClass) => {
        try {
            this.setState({ loading: true });
            const lessons = await lessonService.find(studio, 1, 7);
            if (lessons !== null) {
                this.setState({ lessons });
            }
            this.setState({ loading: false });
        } catch (error) {
            this.setState({ error: true, message: 'Error cargando las clases.', alertVariant: '', loading: false })
        }
    };

    showCreateModal = () => {
        this.setState({ showCreateModal: true });
    };

    closeCreateModal = () => {
        this.loadWeek(this.state.currentDate);
        this.setState({ showCreateModal: false });
    };

    closeAlert = () => {
        this.setState({ error: false });
    };

    closeEditModal = () => {
        this.loadWeek(this.state.currentDate);
        this.setState({ showEditModal: false })
    };

    render() {
        const { lessons, lessonTypes, loadingLessons, error, message, alertVariant } = this.state;
        return (
            <div className="lessons">
                {this.state.loading &&
                    <Overlay>
                        <Loader></Loader>
                    </Overlay>
                }
                {error &&
                    <Alert message={message} variant={alertVariant} parentHandleClose={this.closeAlert}></Alert>
                }
                <div className="lessons__header">
                    <h1 className='header-title'>Clases</h1>
                    <Button onClick={this.showCreateModal}>Crear clase</Button>
                </div>
                <Return goBackCallBack={this.props.routeContext ? this.props.routeContext.returnPrevRoute : undefined}></Return>
                <div className="lessons__calendar">
                    <Calendar
                        currentDate={this.state.currentDate}
                        lessons={lessons}
                        onClick={this.handleLessonClick}
                        loading={loadingLessons}
                        getWeekClick={this.loadWeek}
                    />
                </div>
                <CreateLessonModal
                    lessonTypes={lessonTypes}
                    showMeetingUrl={this.state.studio && this.state.studio!.slug === 'online'}
                    studio={this.state.studio!}
                    show={this.state.showCreateModal}
                    parentHandleClose={this.closeCreateModal}
                    parentHandleAlert={(
                        error: boolean,
                        message: string,
                        alertVariant: string
                    ) => this.setState({ error, message, alertVariant })}
                ></CreateLessonModal>
                <EditLessonModal
                    lessonTypes={lessonTypes}
                    showMeetingUrl={this.state.studio && this.state.studio!.slug === 'online'}
                    lesson={this.state.selectedLesson}
                    studio={this.state.studio!}
                    show={this.state.showEditModal}
                    parentHandleClose={this.closeEditModal}
                    parentHandleAlert={(
                        error: boolean,
                        message: string,
                        alertVariant: string
                    ) => this.setState({ error, message, alertVariant })}
                ></EditLessonModal>
            </div>
        );
    }
}

export default withRouterContext(Lessons);
