import React, { useEffect, useState } from 'react';
import { Modal, Button, FormControl, InputGroup, Alert } from 'react-bootstrap';
import { LessonType } from '../../../../api/LessonType/LessonType';

type Props = {
  lessonType?: LessonType;
  visible?: boolean;
  onClose?: () => void;
  onSave?: (lessonType: LessonType) => void;
}
const LessonTypeModal: React.FC<Props> = ({
  lessonType,
  visible,
  onClose = () => true,
  onSave = () => true
}) => {
  const [name, setName] = useState<undefined | string>(lessonType ? lessonType.name : '');
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    setName(lessonType?.name || '');
  }, [lessonType]);

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  function onSubmit() {
    if (name === undefined || name.trim() === '') {
      setError('Debes escribir un nombre');
      return;
    }
    if (lessonType) {
      lessonType.name = name;
    } else {
      lessonType = {
        id: '',
        name,
      }
    }
    onSave(lessonType);
  }

  return <Modal show={visible} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>{lessonType ? 'Editar clase especial' : 'Crear clase especial'}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Nombre del tipo de clase"
          aria-label="Nombre del tipo de clase"
          aria-describedby="Escribe el nombre de la clase especial"
          onChange={handleNameChange}
          required={true}
          value={name}
        />
        {
          error !== null && <Alert variant={'danger'}>
            {error}
          </Alert>
        }
      </InputGroup>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Cerrar
    </Button>
      <Button variant="primary" onClick={onSubmit}>
        {
          lessonType ? 'Actualizar' : 'Guardar'
        }
      </Button>
    </Modal.Footer>
  </Modal>
}

export default LessonTypeModal;