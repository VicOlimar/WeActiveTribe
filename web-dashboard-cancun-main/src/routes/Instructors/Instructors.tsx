import React, { Component } from "react";
import InstructorService from "../../api/Instructor/index";
import {
  Instructor,
  getIsntructorsResponse
} from "../../api/Instructor/Instructor";
import { Table, Button } from "react-bootstrap";
import Pagination from "../../shared/AppPagination";
import "./Instructors.scss";
import Modal from "../../shared/Modal/index";
import Alert from "../../shared/alert/index";
import RemoveModal from "../../shared/RemoveInstructorModal";
import EditModal from "./EditInstructorModal";
import { mdiAccountEditOutline, mdiAccountRemoveOutline } from '@mdi/js';
import { Icon } from '@mdi/react';
import HorizontalLine from '../../shared/HorizontalLine/HorizontalLine';
import stripHtml from "string-strip-html";
import { withRouterContext } from '../../contexts/RouteContext';
import { DefaultRouteContext } from "../../contexts/RouteContext/RouteContext";
import { RouteComponentProps } from "react-router";
import Overlay from "../../shared/ovelay";
import Loader from "../../shared/Loader";


type Props = RouteComponentProps & {
  routeContext?: DefaultRouteContext;
};
type State = {
  instructors: Instructor[] | undefined;
  loading: boolean;
  error: boolean;
  message: string;
  alertVariant: string;
  pages: number;
  perPage: number;
  activePage: number;
  showModalNew: boolean;
  showRemove: boolean;
  name: string;
  id: number | null;
  showEdit: boolean;
  showPagination: boolean;
};

class Instructors extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      instructors: undefined,
      loading: true,
      error: false,
      message: "",
      alertVariant: "",
      pages: 0,
      perPage: 6,
      activePage: 0,
      showModalNew: false,
      showRemove: false,
      name: "",
      id: null,
      showEdit: false,
      showPagination: false
    };

    this.closeModal = this.closeModal.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.onPaginationClick = this.onPaginationClick.bind(this);
    this.RemoveAction = this.RemoveAction.bind(this);
    this.handleCloseRemove = this.handleCloseRemove.bind(this);

  }

  async componentDidMount() {
    await this.getInstructors(this.state.perPage, this.state.activePage);
  }

  EditAction = (e: any) => {
    const { name, value } = e.currentTarget;
    this.setState({ name: name, id: value });
    this.setState({ showEdit: true });
  }

  RemoveAction = async (e: any) => {
    const { name, value: id } = e.currentTarget;
    const instructor = await InstructorService.findOne(id);
    if (instructor) {
      if (instructor.lessons) {
        if (instructor.lessons!.length > 0) {
          this.setState({ error: true, message: 'El instructor tiene lecciones futuras.', alertVariant: 'warning' });
          return;
        }
      }
    }
    this.setState({ name: name, id: id });
    this.setState({ showRemove: true });
    this.getInstructors(this.state.perPage, this.state.activePage);
  };

  renderInstructors() {
    if (this.state.instructors)
      return this.state.instructors.map(instructor => {
        const { id, name, description } = instructor;
        return (
          <tr>
            <td>{name}</td>
            <td>{stripHtml(description, { stripTogetherWithTheirContents: ['h1', 'h2', 'h3'] })}</td>
            <td>{stripHtml(description, { stripTogetherWithTheirContents: ['p'] })}</td>
            <td>
              <div className='instructors__table__buttons'>
                <button value={id} name={name} onClick={this.EditAction}>
                  <Icon
                    path={mdiAccountEditOutline}
                    title="Editar usuario"
                    size={1}
                    color={'#10a500'}
                  /></button>
                <button value={id} name={name} onClick={this.RemoveAction}>
                  <Icon
                    path={mdiAccountRemoveOutline}
                    title="Eliminar usuario"
                    size={1}
                    color={'#a50000'}
                  /></button>
              </div>
            </td>
          </tr>
        );
      });
  }

  async getInstructors(perPage: number, pages: number) {
    try {
      this.setState({ loading: true });
      const instructorsData:
        | getIsntructorsResponse
        | undefined = await InstructorService.find(perPage, pages);
      if (instructorsData) {
        const { instructors, count } = instructorsData;
        const pages = Math.ceil(count / this.state.perPage);
        if (pages > 1) this.setState({ showPagination: true });
        this.setState({ instructors: instructors, pages: pages });
      }
      this.setState({ loading: false });
    } catch (error) {
      this.setState({
        error: true,
        alertVariant: "error",
        message: error.message,
        loading: false
      });
    }
  }

  onPaginationClick(page: number) {
    this.setState({ activePage: page });
    this.getInstructors(this.state.perPage, page);
  }

  closeModal() {
    this.getInstructors(this.state.perPage, this.state.activePage);
    this.setState({ showModalNew: false });
  }

  showAlert(error: boolean, message: string, alertVariant: string) {
    this.setState({
      error: error,
      message: message,
      alertVariant: alertVariant
    });
  }

  closeAlert() {
    this.setState({ error: false });
  }

  handleCloseRemove() {
    this.getInstructors(this.state.perPage, this.state.activePage);
    this.setState({ showRemove: false });
  }

  handleCloseEdit = () => {
    this.getInstructors(this.state.perPage, this.state.activePage);
    this.setState({ showEdit: false });
  }

  changePaginationAmountItems = (items: number) => {
    this.setState({ perPage: items }, () => this.getInstructors(this.state.perPage, 0));
  }

  render() {
    return (
      <React.Fragment>
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
        <div className="instructors">
          <div className="instructors__header-row">
            <h1 className="header-title">INSTRUCTORES</h1>
          </div>
          <div className='instructors__search-grid'>
            <Button className='instructors__search-grid__new-button' onClick={() => this.setState({ showModalNew: true })}>
              Nuevo
            </Button>
          </div>
          <Table className="instructors__table" bordered hover>
            <thead>
              <tr>
                <th className="instructors__table__th">Nombre</th>
                <th className="instructors__table__th">Descripción</th>
                <th className="instructors__table__th">Frase</th>
                <th className="instructors__table__th">Acciones</th>
              </tr>
            </thead>
            <tbody>{this.renderInstructors()}</tbody>
          </Table>
          <HorizontalLine></HorizontalLine>
          <div className="instructors__pagination">
            {
              <Pagination
                itemsAmount={this.changePaginationAmountItems}
                pages={this.state.pages}
                active={this.state.activePage}
                onClick={this.onPaginationClick}
              ></Pagination>
            }
          </div>
          <Modal
            show={this.state.showModalNew}
            parentCloseModal={this.closeModal}
            parentShowAlert={this.showAlert}
          ></Modal>
          <RemoveModal
            parentLevelAlert={this.showAlert}
            parentLeveClose={this.handleCloseRemove}
            show={this.state.showRemove}
            name={this.state.name}
            id={this.state.id}
          ></RemoveModal>
          <EditModal
            parentLeveClose={this.handleCloseEdit}
            parentLevelAlert={this.showAlert}
            show={this.state.showEdit}
            id={this.state.id}
          ></EditModal>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouterContext(Instructors);
