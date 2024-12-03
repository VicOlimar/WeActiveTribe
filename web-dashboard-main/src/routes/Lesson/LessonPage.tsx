import React, { Component, Fragment } from "react";
import StudioService, { Studio } from "../../api/Studio/Studio";
import LessonService, { Lesson } from "../../api/Lesson/Lesson";
import "./LessonPage.scss";
import { RouteComponentProps, withRouter } from "react-router-dom";
import WeRide from "./components/WeRide";
import AppHeader from "../../shared/AppHeader";
import LessonHeader from "./components/LessonHeader";
import BackgroundRide from "./assets/background-ride.jpg";
import BackgroundHiit from "./assets/background-hiit.jpg";
import moment from "moment-timezone";
import { Instructor } from "../../api/Instructor/Instructor";
import { isUndefined, isNullOrUndefined } from "util";
import { Place } from "../../api/Place/Place";
import WeTrain from "./components/WeTrain";
import ReservationsTable from "./components/Reservations/index";
import ReactToPrint from "react-to-print";
import { Button, Modal } from "react-bootstrap";
import Return from "../../shared/ReturnBtn";
import ReserveModal from "./components/ReserveModal";
import { Plan } from "../../api/Plan/Plan";
import ReservationService from "../../api/Reservation";
import Alert from "../../shared/alert";
import Overlay from "../../shared/ovelay";
import Loader from "../../shared/Loader";
import { withRouterContext } from "../../contexts/RouteContext";
import { DefaultRouteContext } from "../../contexts/RouteContext/RouteContext";
import BlockPlaceService from "../../api/BlockPlace";
import EditLessonModal from "../Lessons/EditLessonModal";
import SweetAlert from "react-bootstrap-sweetalert";
import LessonTypeService, { LessonType } from "../../api/LessonType/LessonType";

type Props = RouteComponentProps<any> & {
  routeContext?: DefaultRouteContext;
};

type State = {
  showEditModal: boolean;
  showEnableModal: boolean;
  studio?: Studio;
  lesson?: Lesson;
  availablePlaces: Place[];
  lockedPlaces: any[];
  hidenPlaces: any[];
  instructors?: Instructor[];
  plans: Plan[];
  plan?: Plan;
  loading: boolean;
  requestingAvailability: boolean;
  errorMessage?: string;
  showInstructorModal: boolean;
  today: Date;
  goBackPressed: boolean;
  assistantsList: any;
  placeSelected?: Place;
  showReserveModal: boolean;
  loadingReserve: boolean;
  reserveError?: string;
  canceledAssistantsList: any;
  error: boolean;
  message: string;
  alertVariant: string;
  showCanceledReservations: boolean;
  instructorsNames: string;
  showUnlockModal: boolean;
  showCancelModal: boolean;
  showCanceledSucess: boolean;
  lessonTypes: LessonType[];
  objectLockedPlace: any;
};

class LessonPage extends Component<Props, State> {
  DATE_FORMAT = "D [de] MMMM [-] h:mm A";
  componentRef: any = null;
  constructor(props: Props) {
    super(props);
    this.state = {
      showEditModal: false,
      showEnableModal: false,
      lesson: undefined,
      studio: undefined,
      availablePlaces: [],
      lockedPlaces: [],
      hidenPlaces: [],
      instructors: [],
      plans: [],
      plan: undefined,
      loading: false,
      requestingAvailability: true,
      errorMessage: undefined,
      showInstructorModal: false,
      today: new Date(),
      goBackPressed: false,
      assistantsList: undefined,
      placeSelected: undefined,
      showReserveModal: false,
      loadingReserve: false,
      reserveError: undefined,
      canceledAssistantsList: undefined,
      error: false,
      message: "",
      alertVariant: "",
      showCanceledReservations: true,
      instructorsNames: "",
      showUnlockModal: false,
      showCancelModal: false,
      showCanceledSucess: false,
      lessonTypes: [],
      objectLockedPlace: {},
    };
  }

  componentDidMount() {
    try {
      this.setState({ loading: true });
      this.getStudio();
      this.getAssistants();
      this.getCanceledAssistants();
      this.getLessonTypes();

      this.setState({ loading: false });
    } catch (error) {
      this.setState({
        error: true,
        message: (error as Error).message,
        alertVariant: "error",
      });
      this.setState({ loading: false });
    }
  }

  /**
   * Get the current studio
   */
  getStudio = async () => {
    const { params } = this.props.match;
    if (params.slug) {
      const studio = await StudioService.findOne(params.slug);
      if (studio) {
        this.setState({ studio }, () => this.getLesson());
      }
    } else {
      this.props.history.push("/");
    }
  };

  getLessonTypes = async () => {
    try {
      const response = await LessonTypeService.list();
      this.setState({ lessonTypes: response });
    } catch (error) {
      this.setState({
        error: true,
        message: "Error al cargal los planes",
        alertVariant: "error",
        loading: false,
      });
    }
  };

  /**
   * Get assistants of a lesson
   */
  getAssistants = async () => {
    const { params } = this.props.match;
    if (params.slug && params.lesson) {
      const assistantsList = await LessonService.getAssistants(
        params.slug,
        params.lesson
      );
      if (assistantsList) {
        await this.setState({ assistantsList });
      }
    } else {
      this.setState({
        error: true,
        message: "Error cargando lista de asistentes",
        alertVariant: "error",
      });
    }
  };

  /**
   * Get assistants of a lesson
   */
  getCanceledAssistants = async () => {
    const { params } = this.props.match;
    if (params.slug && params.lesson) {
      const canceledAssistantsList = await LessonService.getCanceledAssistants(
        params.slug,
        params.lesson
      );
      if (canceledAssistantsList) {
        await this.setState({ canceledAssistantsList });
      }
    } else {
      this.setState({
        error: true,
        message: "Error cargando lista de asistentes",
        alertVariant: "error",
      });
    }
  };

  /**
   * Get the current lesson
   */
  getLesson = async () => {
    const { params } = this.props.match;
    const { studio } = this.state;
    if (params.lesson) {
      const lesson = await LessonService.findOne(studio!, params.lesson);
      if (lesson) {
        this.setState({ lesson, goBackPressed: false }, () => {
          this.getInstructorsNames(lesson);
          this.getAvailables();
        });
      }
    } else {
      this.props.history.push("/");
    }
  };

  /**
   * Get the availables places
   */
  getAvailables = async () => {
    const lesson = this.state.lesson as Lesson | undefined;
    const studio = this.state.studio as Studio | undefined;
    this.setState({ requestingAvailability: true });
    const places = await LessonService.getAvailable(
      studio!,
      Number(lesson!.id)
    );
    const {
      available: availablePlaces,
      locked: lockedPlaces,
      visible: hidenPlaces,
    } = places;
    if (!isUndefined(availablePlaces)) {
      this.setState({ availablePlaces, requestingAvailability: false });
    }
    if (!isNullOrUndefined(lockedPlaces)) {
      const objectLockedPlace: any = {};
      lockedPlaces.forEach((e: any) => {
        if (!objectLockedPlace.hasOwnProperty(e.location)) {
          objectLockedPlace[e.location] = true;
        }
      });
      this.setState({ lockedPlaces, objectLockedPlace });
    }
    if (!isNullOrUndefined(hidenPlaces)) {
      this.setState({ hidenPlaces });
    }
  };

  getInstructorsNames = async (lesson: Lesson) => {
    let instructorsName: string = "";
    if (lesson.instructors) {
      const instructorsNameArray: string[] = await lesson.instructors.map(
        (instructor) => {
          return instructor.name;
        }
      );
      instructorsName = instructorsNameArray.join(", ");
    }
    this.setState({ instructorsNames: instructorsName });
  };

  /**
   * Create the page title
   */
  getPageTitle = () => {
    const lesson: Lesson | undefined = this.state.lesson;
    const studio: Studio | undefined = this.state.studio;
    const starts_at = lesson
      ? moment(lesson!.starts_at).utcOffset("-06:00").format(this.DATE_FORMAT)
      : "";

    return studio && lesson
      ? `${studio!.name} - ${this.state.instructorsNames} (${starts_at})`
      : "Clase";
  };

  /**
   *
   * @param placeNumber - The place number
   */
  onPlaceClick = (place: Place) => {
    this.setState({ placeSelected: place, showReserveModal: true });
  };

  handleReserveModalClose = () => {
    this.setState({ placeSelected: undefined, showReserveModal: false });
  };

  /**
   * Function for get the difference in minutes between two dates
   * @param first_date The first date
   * @param second_date The second date
   */
  getDuration(first_date: Date, second_date: Date) {
    return moment(second_date).diff(moment(first_date), "minutes");
  }

  /**
   * Function used for handle when the user click on the instructor avatar
   */
  handleInstructorClick = () => {
    window.scrollTo(0, 0);
    const { showInstructorModal } = this.state;
    this.setState({ showInstructorModal: !showInstructorModal });
  };

  /**
   * Handle the go back button clicked
   */
  goBack = () => {
    this.props.history.goBack();
    this.setState({ goBackPressed: true });
  };

  /**
   * Callback for the reservation modal
   */
  doReservation = async (user?: any) => {
    try {
      const { placeSelected, lesson } = this.state;
      if (!user) {
        this.setState({ reserveError: "Debes seleccionar un usuario." });
      } else if (placeSelected && lesson) {
        this.setState({ loadingReserve: true });
        const response = await ReservationService.create(
          lesson.id,
          placeSelected.id,
          user.value
        );
        if (typeof response === "string") {
          this.setState({ loadingReserve: false, reserveError: response });
        } else {
          this.getAssistants();
          this.getAvailables();
          this.setState({
            loadingReserve: false,
            reserveError: undefined,
            showReserveModal: false,
          });
        }
      }
    } catch (error) {
      this.setState({ loadingReserve: false, loading: false });
    }
  };

  visiblePlace = async () => {
    const { placeSelected, lesson } = this.state;
    if (placeSelected && lesson) {
      const hidePlace = await BlockPlaceService.create(
        lesson.id as number,
        placeSelected.id as number,
        false
      );
      if (typeof hidePlace !== "string") {
        this.setState({
          error: true,
          message: "Lugar bloqueado exitosamente",
          alertVariant: "success",
        });
        this.getAssistants();
        this.getAvailables();
        this.setState({
          loadingReserve: false,
          reserveError: undefined,
          showReserveModal: false,
        });
      } else {
        this.setState({
          error: true,
          message: hidePlace,
          alertVariant: "error",
        });
      }
    }
  };

  closeAlert = () => {
    this.setState({ error: false, message: "", alertVariant: "" });
  };

  showCanceledReservations = () => {
    this.setState({ showCanceledReservations: true });
  };

  doBlocking = async () => {
    const { placeSelected, lesson } = this.state;
    if (placeSelected && lesson) {
      const BlockPlace = await BlockPlaceService.create(
        lesson.id as number,
        placeSelected.id as number
      );
      if (typeof BlockPlace !== "string") {
        this.setState({
          error: true,
          message: "Lugar bloqueado exitosamente",
          alertVariant: "success",
        });
        this.getAssistants();
        this.getAvailables();
        this.setState({
          loadingReserve: false,
          reserveError: undefined,
          showReserveModal: false,
        });
      } else {
        this.setState({
          error: true,
          message: BlockPlace,
          alertVariant: "error",
        });
      }
    }
  };

  unlockPlace = async () => {
    try {
      const { placeSelected, lockedPlaces } = this.state;
      if (placeSelected) {
        const lockedPlace = lockedPlaces.find(
          (lockedPlace) =>
            lockedPlace.BlockedPlace.place_id === placeSelected.id
        );
        this.setState({ loading: true });
        if (!lockedPlace.BlockedPlace) {
          this.setState({
            error: true,
            message:
              "Este lugar se encuentra bloqueado por nueva distribución por COVID.",
            alertVariant: "error",
            loading: false,
          });
        }
        const placeUnlocked = await BlockPlaceService.unlock(
          lockedPlace.BlockedPlace.id
        );
        if (typeof placeUnlocked !== "string")
          this.setState(
            {
              error: true,
              message: "Lugar desbloqueado exitosamente",
              alertVariant: "success",
              loading: false,
              showUnlockModal: false,
            },
            () => {
              this.getAssistants();
              this.getAvailables();
            }
          );
        else {
          this.setState({ loading: false });
          throw new Error(placeUnlocked);
        }
      }
    } catch (error) {
      this.setState({
        error: true,
        message: (error as Error).message,
        alertVariant: "error",
        loading: false,
      });
    }
  };

  enablePlace = async () => {
    try {
      const { placeSelected, hidenPlaces } = this.state;

      if (placeSelected) {
        const hidenPlace = hidenPlaces.find(
          (hidenPlace) => hidenPlace.BlockedPlace.place_id === placeSelected.id
        );
        this.setState({ loading: true });

        const placeEnamble = await BlockPlaceService.enable(
          hidenPlace.BlockedPlace.id
        );
        if (typeof placeEnamble !== "string")
          this.setState(
            {
              error: true,
              message: "Lugar desbloqueado exitosamente",
              alertVariant: "success",
              loading: false,
              showEnableModal: false,
            },
            () => {
              this.getAssistants();
              this.getAvailables();
            }
          );
        else {
          this.setState({ loading: false });
          throw new Error(placeEnamble);
        }
      }
    } catch (error) {
      this.setState({
        error: true,
        message: (error as Error).message,
        alertVariant: "error",
        loading: false,
      });
    }
  };

  cancelLesson = async () => {
    try {
      const { lesson, studio } = this.state;
      if (lesson) {
        if (studio && lesson) {
          const response = await LessonService.cancel(
            studio,
            parseInt(lesson.id as string)
          );
          if (response < 400) {
            this.closeCancelModal();
            this.closeSuccessMessage();
          } else {
            this.setState({
              error: true,
              message: "Ocurrió un error al cancelar la clase.",
              alertVariant: "error",
            });
          }
        }
      }
      this.closeCancelModal();
    } catch (error) {
      this.setState({
        error: true,
        message: (error as Error).message,
        alertVariant: "error",
      });
      this.closeCancelModal();
    }
  };

  closeEditModal = () => {
    this.setState({ showEditModal: false }, () => this.getStudio());
  };

  closeCancelModal = () => {
    this.setState({ showCancelModal: false });
  };

  closeSuccessMessage = () => {
    const { showCanceledSucess } = this.state;
    this.setState({ showCanceledSucess: !showCanceledSucess });
  };

  goToCalendar = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      availablePlaces,
      showInstructorModal,
      loadingReserve,
      reserveError,
      lockedPlaces,
      hidenPlaces,
      lessonTypes,
    } = this.state;
    const lesson: Lesson | undefined = this.state.lesson;
    const studio: Studio | undefined = this.state.studio;
    const instructors: Instructor[] | undefined = this.state.instructors;

    let duration = 0;
    if (!isUndefined(lesson)) {
      duration = this.getDuration(lesson!.starts_at, lesson!.ends_at);
    }

    let background = BackgroundRide;

    if (!isUndefined(studio)) {
      background = studio!.slug === "we-ride" ? BackgroundRide : BackgroundHiit;
    }

    return (
      <React.Fragment>
        <h1 className="header-title">{this.getPageTitle()}</h1>

        <div className="lesson__search-grid">
          <div className="lesson__search-grid__return">
            <Return
              goBackCallBack={() =>
                this.props.routeContext
                  ? this.props.routeContext.returnPrevRoute(
                      this.props.location.state
                    )
                  : () => {}
              }
            ></Return>
          </div>
          <Button
            className="lesson__search-grid__cancel"
            style={{ height: "40px" }}
            onClick={() => {
              this.setState({ showCancelModal: true });
            }}
          >
            Cancelar clase
          </Button>
          <Button
            className="lesson__search-grid__button"
            style={{ height: "40px" }}
            onClick={() => {
              this.setState({ showEditModal: true });
            }}
          >
            Editar clase
          </Button>
        </div>

        {this.state.error && (
          <Alert
            message={this.state.message}
            variant={this.state.alertVariant}
            parentHandleClose={this.closeAlert}
          ></Alert>
        )}

        {this.state.loading && (
          <Overlay>
            <Loader></Loader>
          </Overlay>
        )}
        <div
          className="lesson_section"
          style={{ backgroundImage: `url(${background})` }}
        >
          <AppHeader
            leftComponent={
              <LessonHeader
                leftText={
                  lesson
                    ? moment(lesson!.starts_at)
                        .utcOffset("-06:00")
                        .format(this.DATE_FORMAT)
                    : ""
                }
              />
            }
          />
          <div className="inline-flex lesson_section__indications">
            <div className="lesson_section__indications__first">
              <div
                className={`lesson_section__indications__first__icon lesson_section__indications__first__icon-${
                  studio ? studio!.slug : ""
                }`}
              ></div>
              <span>Reservado</span>
            </div>
            <div className="lesson_section__indications__second">
              <div className="lesson_section__indications__second__icon"></div>
              <span>Disponible</span>
            </div>

            <div className="lesson_section__indications__first">
              <div
                className={`lesson_section__indications__first__icon lesson_section__indications__first__icon-disable`}
              ></div>
              <span>Deshabilitado</span>
            </div>
          </div>
          <ReserveModal
            place={this.state.placeSelected}
            show={this.state.showReserveModal}
            onClose={this.handleReserveModalClose}
            onConfirm={this.doReservation}
            onConfirmVisible={this.visiblePlace}
            onConfirmBlock={this.doBlocking}
            loading={loadingReserve}
            message={reserveError}
          />
          {studio && studio!.slug !== "online" && (
            <div className="lesson_section__content">
              {
                <Fragment>
                  {studio && studio!.slug === "we-ride" && (
                    <WeRide
                      places={availablePlaces}
                      onClickUnlock={(place: Place) => {
                        this.setState({
                          showUnlockModal: true,
                          placeSelected: place,
                        });
                      }}
                      onClickVisible={(place: Place) => {
                        this.setState({
                          showEnableModal: true,
                          placeSelected: place,
                        });
                      }}
                      lockedPlaces={lockedPlaces}
                      hidenPlaces={hidenPlaces}
                      name={
                        instructors
                          ? instructors[0]
                            ? instructors[0].name
                            : ""
                          : ""
                      }
                      description={
                        instructors
                          ? instructors[0]
                            ? instructors[0].description
                            : ""
                          : ""
                      }
                      avatar={
                        instructors
                          ? instructors[0]
                            ? instructors[0].avatar
                            : undefined
                          : undefined
                      }
                      duration={duration}
                      onClick={this.onPlaceClick}
                      onInstructorClick={this.handleInstructorClick}
                      showInstructor={showInstructorModal}
                    />
                  )}
                  {studio && studio!.slug === "we-hiit" && (
                    <WeTrain
                      places={availablePlaces}
                      onClickUnlock={(place: Place) => {
                        this.setState({
                          showUnlockModal: true,
                          placeSelected: place,
                        });
                      }}
                      onClickVisible={(place: Place) => {
                        this.setState({
                          showEnableModal: true,
                          placeSelected: place,
                        });
                      }}
                      lockedPlaces={lockedPlaces}
                      hidenPlaces={hidenPlaces}
                      name={
                        instructors
                          ? instructors[0]
                            ? instructors[0].name
                            : ""
                          : ""
                      }
                      description={
                        instructors
                          ? instructors[0]
                            ? instructors[0].description
                            : ""
                          : ""
                      }
                      avatar={
                        instructors
                          ? instructors[0]
                            ? instructors[0].avatar
                            : undefined
                          : undefined
                      }
                      duration={duration}
                      onClick={this.onPlaceClick}
                      onInstructorClick={this.handleInstructorClick}
                      showInstructor={showInstructorModal}
                    />
                  )}
                </Fragment>
              }
            </div>
          )}
        </div>
        <div>
          <div className="print-btn-row">
            <ReactToPrint
              trigger={() => <Button>Imprimir</Button>}
              onBeforeGetContent={async () =>
                await this.setState({ showCanceledReservations: false })
              }
              onAfterPrint={() =>
                this.setState({ showCanceledReservations: true })
              }
              content={() => this.componentRef}
            ></ReactToPrint>
          </div>
          {this.state.assistantsList &&
            this.state.studio &&
            this.state.instructors &&
            this.state.lesson && (
              <ReservationsTable
                canceledList={this.state.canceledAssistantsList}
                date={this.state.lesson.starts_at}
                instructorsNames={this.state.instructorsNames}
                list={this.state.assistantsList}
                studio={this.state.studio!}
                showCanceledReservations={this.state.showCanceledReservations}
                ref={(el) => (this.componentRef = el)}
                objectLockedPlace={this.state.objectLockedPlace}
              ></ReservationsTable>
            )}
        </div>
        <Modal
          className="unlock-modal"
          onHide={() => this.setState({ showUnlockModal: false })}
          show={this.state.showUnlockModal}
        >
          <Modal.Header>
            <h4>Confirmación</h4>
          </Modal.Header>
          <Modal.Body>
            <p>¿Desea desbloquear este lugar?</p>
            <div className="unlock-modal__buttons">
              <Button
                variant="secondary"
                onClick={() => this.setState({ showUnlockModal: false })}
              >
                Cancelar
              </Button>
              <Button onClick={this.unlockPlace}>Confirmar</Button>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          className="unlock-modal"
          onHide={() => this.setState({ showEnableModal: false })}
          show={this.state.showEnableModal}
        >
          <Modal.Header>
            <h4>Confirmación</h4>
          </Modal.Header>
          <Modal.Body>
            <p>¿Deseas habilitar este lugar?</p>
            <div className="unlock-modal__buttons">
              <Button
                variant="secondary"
                onClick={() => this.setState({ showEnableModal: false })}
              >
                Cancelar
              </Button>
              <Button onClick={this.enablePlace}>Confirmar</Button>
            </div>
          </Modal.Body>
        </Modal>
        <EditLessonModal
          lessonTypes={lessonTypes}
          showMeetingUrl={
            this.state.studio && this.state.studio!.slug === "online"
          }
          lesson={this.state.lesson}
          studio={this.state.studio!}
          show={this.state.showEditModal}
          parentHandleClose={this.closeEditModal}
          parentHandleAlert={(
            error: boolean,
            message: string,
            alertVariant: string
          ) => this.setState({ error, message, alertVariant })}
        ></EditLessonModal>
        <SweetAlert
          show={this.state.showCancelModal}
          cancelBtnBsStyle="secondary"
          type="warning"
          title={"¿Desea cancelar la clase?"}
          onConfirm={() => this.cancelLesson()}
          confirmBtnText="Confirmar"
          onCancel={() => this.setState({ showCancelModal: false })}
          cancelBtnText="Cerrar"
          showCancel={true}
        ></SweetAlert>
        <SweetAlert
          show={this.state.showCanceledSucess}
          title="Listo"
          onConfirm={() => {
            this.closeSuccessMessage();
            this.goToCalendar();
          }}
          confirmBtnText="Cerrar"
        >
          <p style={{ paddingBottom: "1rem" }}>Clase cancelada correctamente</p>
        </SweetAlert>
      </React.Fragment>
    );
  }
}

export default withRouterContext(withRouter(LessonPage));
