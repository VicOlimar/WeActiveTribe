import { mdiTableEdit, mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react';
import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { LessonType } from '../../../../api/LessonType/LessonType';
import './LessonTypesTable.scss';

type Props = {
  lessonTypes: LessonType[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

type RowProps = {
  lessonType: LessonType;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const LessonTypeRow: React.FC<RowProps> = ({
  lessonType,
  onDelete,
  onEdit,
}) => {
  const deleteLessonType = () => onDelete(Number(lessonType.id));
  const editLessonType = () => onEdit(Number(lessonType.id));
  return <tr>
    <td className='text-center'>
      {lessonType.name}
    </td>
    <td>
      <span className='lesson_types_table__buttons'>
        <OverlayTrigger
          key={`plan-trigger-${lessonType.id}`}
          placement={'top'}
          overlay={
            <Tooltip id={`plan-tooltip-${lessonType.id}`}>
              Editar
            </Tooltip>
          }
        >
          <button onClick={editLessonType}>
            <Icon
              path={mdiTableEdit}
              size={1}
              color={'#10a500'}
            /></button>
        </OverlayTrigger>
        <OverlayTrigger
          key={`remove-trigger-${lessonType.id}`}
          placement={'top'}
          overlay={
            <Tooltip id={`remove-tooltip-${lessonType.id}`}>
              Borrar tipo de clase
            </Tooltip>
          }
        >
          <button onClick={deleteLessonType}>
            <Icon
              path={mdiTrashCanOutline}
              size={1}
              color={'#ff0000'}
            /></button>
        </OverlayTrigger>
      </span>
    </td>
  </tr>
}
const LessonTypesTable: React.FC<Props> = ({
  lessonTypes,
  onEdit = () => true,
  onDelete = () => true,
}) => {
  return <Table className="lesson_types_table" bordered hover responsive>
    <thead className="lesson_types_table-header">
      <tr>
        <th>Nombre</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {
        lessonTypes.length === 0 && <tr>
          <td colSpan={2} className='text-center'>No se tienen clases especiales</td>
        </tr>
      }
      {
        lessonTypes.map((lessonType: LessonType) => <LessonTypeRow
          lessonType={lessonType}
          onDelete={onDelete}
          onEdit={onEdit}
        />)
      }
    </tbody>
  </Table>
}

export default LessonTypesTable;