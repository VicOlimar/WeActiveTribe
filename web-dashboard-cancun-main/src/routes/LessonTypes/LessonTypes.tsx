import React, { Component } from 'react';
import { Button, Overlay, Row, Col } from 'react-bootstrap';
import Pagination from "../../shared/AppPagination";
import LessonTypeService from '../../api/LessonType';
import Alert from '../../shared/alert';
import Loader from '../../shared/Loader';
import LessonTypesTable from './components/LessonTypesTable';
import { LessonType } from '../../api/LessonType/LessonType';
import './LessonTypes.scss';
import LessonTypeModal from './components/LessonTypeModal';

enum EAlertTypes {
  DANGER = 'danger',
  SUCCESS = 'success',
}

type State = {
  loading: boolean;
  error: boolean;
  message: string;
  lessonTypes: LessonType[];
  selectedLessonType?: LessonType;
  page: number;
  pageSize: number;
  count: number;
  showModal: boolean;
  alertType: EAlertTypes;
}

type Props = {

}

class LessonTypes extends Component<Props, State> {
  state = {
    selectedLessonType: undefined,
    loading: false,
    message: '',
    error: false,
    lessonTypes: [],
    page: 1,
    pageSize: 6,
    count: 0,
    showModal: false,
    alertType: EAlertTypes.DANGER,
  }

  componentDidMount() {
    this.getLessonTypes();
  }

  getLessonTypes = async () => {
    try {
      const { page, pageSize } = this.state;
      this.setState({ loading: true });
      const response = await LessonTypeService.paginate(page, pageSize);
      this.setState({ lessonTypes: response.data, count: response.count, loading: false });
    } catch (error) {
      this.setState({ message: error.message, error: true, loading: false, alertType: EAlertTypes.DANGER });
    }
  }

  closeAlert = () => {
    this.setState({ error: false, message: '', alertType: EAlertTypes.DANGER });
  };

  changePageSize = (items: number) => {
    this.setState({ pageSize: items, page: 1 }, this.getLessonTypes);
  }

  onPaginationClick = (page: number) => {
    this.setState({ page }, this.getLessonTypes);
  }

  onEdit = (id: number) => {
    const { lessonTypes } = this.state;
    const lessonType = lessonTypes.find((lessonType: LessonType) => lessonType.id === id);
    this.setState({ selectedLessonType: lessonType, showModal: true });
  }

  handleSave = async (lessonType: LessonType) => {
    try {
      if (lessonType.id !== '') {
        await LessonTypeService.update(lessonType);
      } else {
        await LessonTypeService.create(lessonType);
      }
      let message = `Clase especial ${lessonType.id !== '' ? 'actualizada' : 'creada'} correctamente`;
      this.setState({
        error: true,
        message,
        selectedLessonType: undefined,
        showModal: false,
        alertType: EAlertTypes.SUCCESS,
        page: 1
      }, this.getLessonTypes);
    } catch (error) {
      this.setState({ error: true, message: error.message, alertType: EAlertTypes.DANGER });
    }
  }

  handleDelete = async (id: number) => {
    try {
      const { lessonTypes } = this.state;
      const lessonType = lessonTypes.find((lessonType: LessonType) => lessonType.id === id);

      await LessonTypeService.remove(lessonType!);

      let message = `Clase especial eliminada correctamente`;
      this.setState({
        error: true,
        message,
        selectedLessonType: undefined,
        showModal: false,
        alertType: EAlertTypes.SUCCESS,
        page: 1,
      }, this.getLessonTypes);
    } catch (error) {
      this.setState({ error: true, message: error.message, alertType: EAlertTypes.DANGER });
    }
  }

  closeModal = () => {
    this.setState({ showModal: false, selectedLessonType: undefined });
  }

  render() {
    const {
      loading,
      message,
      error,
      lessonTypes,
      page,
      pageSize,
      count,
      showModal,
      selectedLessonType,
      alertType,
    } = this.state;
    const showCreateModal = () => this.setState({ showModal: true });

    return <div className={'lesson_types'}>
      <LessonTypeModal
        lessonType={selectedLessonType}
        visible={showModal}
        onClose={this.closeModal}
        onSave={this.handleSave}
      />
      {loading &&
        <Overlay>
          <Loader></Loader>
        </Overlay>
      }
      {error &&
        <Alert message={message} variant={alertType} parentHandleClose={this.closeAlert}></Alert>
      }
      <Row>
        <Col xs={6}>
          <h1 className='header-title'>Clases especiales</h1>
        </Col>
        <Col className='text-center' xs={6}>
          <Button className='lesson_types__add_btn' onClick={showCreateModal}>Crear nueva clase</Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs={12}>
          <LessonTypesTable
            lessonTypes={lessonTypes}
            onEdit={this.onEdit}
            onDelete={this.handleDelete} />
        </Col>
        <Col xs={12}>
          <div className="lesson_types__pagination">
            <Pagination
              itemsAmount={this.changePageSize}
              pages={count / pageSize}
              active={page}
              onClick={this.onPaginationClick}
            />
          </div>
        </Col>
      </Row>
    </div >
  }
}

export default LessonTypes;